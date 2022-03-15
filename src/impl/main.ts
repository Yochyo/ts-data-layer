import { IDataSource } from '../data-source';
import { Observable, of } from 'rxjs';
import { Repository } from '../repository';
import { Set } from '../decorators';

export type User = {
  name: string;
  age: number;
};

interface IUserDataLayer {
  setAge: (age: number) => Observable<User>;
}
interface UserDataSource extends IDataSource<User, User>, IUserDataLayer {}

export class ImplDataSource implements UserDataSource {
  private user: User = { name: '1', age: 0 };
  getAll(): Observable<User> {
    return of(this.user);
  }

  setAll(data: User): Observable<User> {
    this.user = data;
    return this.getAll();
  }

  setAge(age: number): Observable<User> {
    this.user.age = age;
    console.log('age was set to ' + age + ' in source');
    return of(this.user);
  }
}

export class ImplRepository extends Repository<User> implements IUserDataLayer {
  @Set
  setAge(age: number): Observable<User> {
    throw new Error();
  }
}

new ImplRepository({
  primary: new ImplDataSource(),
})
  .setAge(1)
  .subscribe();
