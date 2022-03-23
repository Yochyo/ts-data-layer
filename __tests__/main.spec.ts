// TODO test with datasource that contains no default value

// TODO Eine SetSubset annotation

import { catchError, of, timeout } from 'rxjs';
import { TestImplDataSource, TestImplRepository } from '../src/utils';

test('_subject$ should not emit a value', done => {
  const repo = new TestImplRepository({
    primary: new TestImplDataSource(),
  });

  repo._subject$
    .pipe(
      timeout(100),
      catchError(_ => of(`Request timed out after: 100`))
    )
    .subscribe({
      next: _ => fail('_subject emitted a value for some reason'),
      complete: () => done(),
    });
});

test('subject$ should emit default value', done => {
  const repo = new TestImplRepository({
    primary: new TestImplDataSource(),
  });
  repo.subject$.subscribe({
    next: next => {
      expect(next).toBe(TestImplDataSource.DEFAULT);
      done();
    },
    error: err => console.error(err),
  });
});
test('subject$ should emit values twice', done => {
  const repo = new TestImplRepository({
    primary: new TestImplDataSource(),
  });
  let first = true;
  repo.subject$.subscribe({
    next: next => {
      if (first) {
        console.log('first');
        expect(next).toBe(TestImplDataSource.DEFAULT);
        first = false;
        repo.setAge(10);
      } else {
        console.log('second');
        expect(next).toBe({ ...TestImplDataSource.DEFAULT, age: 10 });
        done();
      }
    },
    error: err => console.error(err),
  });
});
