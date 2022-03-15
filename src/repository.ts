import { IDataSource } from './data-source';
import { Observable, ReplaySubject } from 'rxjs';

/**
 * @interface DataSources interface passed to Repository
 * @property {IDataSource} main the main.ts datasource. Every Repository requires at least one datasource
 * @property {IDataSource | IDataSource[]} sub datasource(s) that are used to pull data from when the main.ts datasource cannot be used
 * @property {boolean?} set false to disable cache, otherwise enables cache
 * @property {number?} cache.ttl time the cached value lives in ms
 * @property {number?} refresh the cache is refreshed automatically when subscribe is called after n ms since the last update
 */

export interface IRepository<T> {
  readonly primary: IDataSource<T, T>;
  readonly secondary?: IDataSource<T, T>[];
}

export interface DataSources<T> extends IRepository<T> {
  cache?: {
    enabled?: boolean;
    ttl?: number; // TODO
    refresh?: number; // TODO
  };
}

export abstract class Repository<T> implements IRepository<T> {
  readonly _subject$: ReplaySubject<T>;
  readonly _sources: DataSources<T>;

  readonly primary: IDataSource<T, T>;
  readonly secondary?: IDataSource<T, T>[];

  constructor(sources: DataSources<T>) {
    this._subject$ = new ReplaySubject(!sources.cache?.enabled ? 0 : 1, sources.cache?.ttl ?? Infinity);
    this._sources = sources;
    this.primary = sources.primary;
    this.secondary = sources.secondary;
  }

  // private _emit(): Observable<unknown> {}

  // private _getFromSource(): Observable<T> {
  //   const fork$ = forkJoin(
  //     this._sources.sources.map(it =>
  //       it.getAll().pipe(
  //         catchError(err => {
  //           // TODO should detailed information be printed here
  //           console.error(err);
  //           return of(undefined);
  //         }),
  //         first()
  //       )
  //     )
  //   );
  //   return fork$.pipe(
  //     map(results => {
  //       const first = results.find(it => it != undefined);
  //       if (first == undefined) throw new Error('no data source was able to supply the data');
  //       return first;
  //     })
  //   );
  //   // TODO check that main.ts source is always first
  // }

  // private _shouldUpdate = () => this._sources.
}