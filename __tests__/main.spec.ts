// TODO test with datasource that contains no default value
// TODO Eine SetSubset annotation

import { first, Observable, of, timeout } from 'rxjs';
import { IDataSource } from '../src/data-source';
import { Repository } from '../src/repository';
import { Set } from '../src/decorators';

type User = {
  age: number;
};

const DEFAULT = { age: 0 } as const;

export interface IUserDataLayer {
  setAge: (age: number) => Observable<User>;
}
export interface UserDataSource extends IDataSource<User>, IUserDataLayer {}

export class ImplDataSource implements UserDataSource {
  private user: User;

  constructor(user: User = { ...DEFAULT }) {
    this.user = user;
  }

  getAll(): Observable<User> {
    return of(this.user);
  }

  setAll(data: User): Observable<User> {
    this.user = data;
    return this.getAll();
  }

  setAge(age: number): Observable<User> {
    this.user.age = age;
    return of(this.user);
  }
}

export class TestImplRepository extends Repository<User> implements IUserDataLayer {
  @Set
  setAge(age: number): Observable<User> {
    throw new Error();
  }
}

test('_subject$ should not emit a value', done => {
  const repo = new TestImplRepository({ primary: new ImplDataSource() });
  repo._subject$.pipe(timeout(100)).subscribe({
    next: _ => fail('_subject emitted a value for some reason'),
    error: _ => done(),
  });
});

test('subject$ should emit default value', done => {
  const repo = new TestImplRepository({ primary: new ImplDataSource() });
  repo.subject$.subscribe({
    next: next => {
      expect(next).toStrictEqual(DEFAULT);
      done();
    },
    error: err => fail(err),
  });
});

test('subject$ should emit multiple values', done => {
  const repo = new TestImplRepository({ primary: new ImplDataSource() });
  let count = 0;
  repo.subject$.subscribe({
    next: next => {
      expect(next).toStrictEqual({ age: 10 * count });
      if (count == 10) done();
      else repo.setAge(10 * ++count).subscribe();
    },
    error: err => fail(err),
  });
});

test('subject$ should emit multiple values and be caught my multiple subscribers', done => {
  const repo = new TestImplRepository({ primary: new ImplDataSource() });
  let count = 0;
  repo.subject$.subscribe({
    next: next => {
      expect(next).toStrictEqual({ age: 10 * count });
      if (count < 10) repo.setAge(10 * ++count).subscribe();
    },
    error: err => fail(err),
  });

  repo.subject$.subscribe({
    next: next => {
      expect(next).toStrictEqual({ age: 10 * count });
      if (count == 10) done();
    },
    error: err => fail(err),
  });
});

test('last element was cached', done => {
  const repo = new TestImplRepository({ primary: new ImplDataSource() });
  repo.subject$.pipe(first()).subscribe({
    next: next => {
      repo.setAge(DEFAULT.age + 1).subscribe(_ =>
        repo.subject$.subscribe(it => {
          expect(it).toStrictEqual({ age: DEFAULT.age + 1 });
          done();
        })
      );
    },
    error: err => fail(err),
    complete: () => console.log('completed'),
  });
});
