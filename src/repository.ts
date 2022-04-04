import { IDataSource } from './data-source';
import { concat, first, Observable, ReplaySubject, tap } from 'rxjs';
import { Set } from './decorators';

/**
 * @interface DataSources interface passed to Repository
 * @property {IDataSource} main the main.spec.ts datasource. Every Repository requires at least one datasource
 * @property {IDataSource | IDataSource[]} sub datasource(s) that are used to pull data from when the main.spec.ts datasource cannot be used
 * @property {boolean?} set false to disable cache, otherwise enables cache
 * @property {number?} cache.ttl time the cached value lives in ms
 * @property {number?} refresh the cache is refreshed automatically when subscribe is called after n ms since the last update
 */

export interface IRepository<T> {
  readonly primary: IDataSource<T>;
  readonly secondary?: IDataSource<T>[];
}

export interface DataSources<T> extends IRepository<T> {
  cache?: {
    enabled?: boolean;
    ttl?: number;
    refresh?: number; // TODO
  };
}

export abstract class Repository<T> implements IRepository<T> {
  readonly _subject$: ReplaySubject<T>;
  readonly _sources: DataSources<T>;

  readonly primary: IDataSource<T>;
  readonly secondary?: IDataSource<T>[];

  constructor(sources: DataSources<T>) {
    this._subject$ = new ReplaySubject(!sources.cache?.enabled ? 0 : 1, sources.cache?.ttl ?? Infinity);
    this._sources = sources;
    this.primary = sources.primary;
    this.secondary = sources.secondary;
  }

  get subject$(): Observable<T> {
    // TODO temp fix but should use switchmap or so
    if (this._subject$.isEmpty())
      this.get().subscribe({
        next: next => this._subject$.next(next),
        error: err => console.error('err ' + err),
      });
    return this._subject$;
  }

  @Set
  public setAge(age: number) {
    throw new Error();
  }
  // private _emit(): Observable<unknown> {}

  // private get(): Observable<T> {
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
  //   // TODO check that main.spec.ts source is always first
  // }

  // private _shouldUpdate = () => this._sources.

  private get(): Observable<T> {
    return concat(this.primary.getAll(), ...(this.secondary?.map(it => it.getAll()) ?? [])).pipe(first());
  }
}

declare module 'rxjs' {
  // eslint-disable-next-line no-unused-vars
  interface ReplaySubject<T> {
    isEmpty(): boolean;
  }
}

// https://stackoverflow.com/a/41586938/7469737
ReplaySubject.prototype.isEmpty = function () {
  // @ts-ignore
  this._trimBuffer();
  // @ts-ignore
  return this._buffer.length == 0;
};
