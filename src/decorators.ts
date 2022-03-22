import { Repository } from './repository';
import { catchError, first, forkJoin, merge, Observable, of, switchMap, tap } from 'rxjs';
import { IDataSource } from './data-source';

/**
 * updates the value of a datasource and emits a change in the repository as long as updating the primary datasource was successful.
 * If updating the primary source was successful, the secondary sources are updated as well. Failure will throw an exception.
 * @param target
 * @param propertyKey
 * @param descriptor
 * @constructor
 */
export function Set(target: Repository<any>, propertyKey: string, descriptor: PropertyDescriptor) {
  descriptor.value = function (...args: any) {
    // get repository
    const obj = this as Repository<any>;
    // get primary source and call its method (has to be the same name)
    const observable = (obj.primary as any)[propertyKey].apply(obj.primary, args);
    // TODO was passiert wenn primary ein fehler wirft? Wird switchMap dann aufgerufen?
    return observable.pipe(
      // emits change if successful
      tap(res => obj._subject$.next(res)),
      // TODO wenn error sollen die secondaries nicht geschrieben werden
      // if successful, tries updating all secondary sources
      switchMap(res => {
        if (obj.secondary == undefined) return of(res);

        // TODO setAll kann undefined sein
        // returns result of primary source
        return forkJoin(obj.secondary?.map(secondary => (secondary as IDataSource<any>).setAll!.apply(secondary, args))).pipe(switchMap(_ => of(res)));
      })
    );
  };
}

// TODO is this needed?
export function Get(target: Repository<any>, propertyKey: string, descriptor: PropertyDescriptor) {
  descriptor.value = function (...args: any) {
    const obj = this as Repository<any>;
    const observable = (obj.primary as any)[propertyKey].apply(obj.primary, args);
    // TODO was passiert wenn primary ein fehler wirft? Wird switchMap dann aufgerufen?
    return observable.pipe(
      catchError(err => {
        console.error(`error calling ${propertyKey}() with args ${args}`);
        const secondaryResults = obj.secondary?.map((secondary: any) => secondary[propertyKey].apply(obj.secondary, args)) as Observable<any>[] | undefined;
        if (secondaryResults == undefined) return of(err);
        return merge(secondaryResults).pipe(first());
      })
    );
  };
}
