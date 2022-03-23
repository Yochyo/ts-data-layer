import { Observable, of } from 'rxjs';
import { IDataSource } from './data-source';
import { Repository } from './repository';
import { Set } from './decorators';

export type TestUser = {
  name: string;
  age: number;
};

export interface ITestUserDataLayer {
  setAge: (age: number) => Observable<TestUser>;
}
export interface TestUserDataSource extends IDataSource<TestUser>, ITestUserDataLayer {}

export class TestImplDataSource implements TestUserDataSource {
  static DEFAULT = { name: 'null', age: 0 };
  private user: TestUser;

  constructor(user: TestUser = TestImplDataSource.DEFAULT) {
    this.user = user;
  }

  getAll(): Observable<TestUser> {
    return of(this.user);
  }

  setAll(data: TestUser): Observable<TestUser> {
    this.user = data;
    return this.getAll();
  }

  setAge(age: number): Observable<TestUser> {
    this.user.age = age;
    return of(this.user);
  }
}

export class TestImplRepository extends Repository<TestUser> implements ITestUserDataLayer {
  @Set
  setAge(age: number): Observable<TestUser> {
    throw new Error();
  }
}
