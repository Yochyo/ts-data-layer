import { Repository } from './repository';
import { forkJoin, of, switchMap, tap } from 'rxjs';
import { IDataSource } from './data-source';

export function Set(target: Repository<any>, propertyKey: string, descriptor: PropertyDescriptor) {
  descriptor.value = function (...args: any) {
    const obj = this as Repository<any>;
    const observable = (obj.primary as any)[propertyKey].apply(obj.primary, args);
    // TODO was passiert wenn primary ein fehler wirft? Wird switchMap dann aufgerufen?
    return observable.pipe(
      tap(res => obj._subject$.next(res)),
      // TODO wenn error sollen die secondaries nicht geschrieben werden
      switchMap(res => {
        if (obj.secondary == undefined) return of(res);
        // TODO setAll kann undefined sein
        return forkJoin(obj.secondary?.map(secondary => (secondary as IDataSource<any>).setAll!.apply(secondary, args))).pipe(switchMap(_ => of(res)));
      })
    );
  };
}
