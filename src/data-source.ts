import { Observable } from 'rxjs';

/**
 * Every method in a DataSource should return an Observable<T>
 */
export interface IDataSource<T> {
  getAll(): Observable<T>;
  setAll?(data: T): Observable<T>;
}
