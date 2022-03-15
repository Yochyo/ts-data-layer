import { Observable } from 'rxjs';

export interface IDataSource<In, Out> {
  getAll(): Observable<Out>;
  setAll(data: In): Observable<Out>;
}
