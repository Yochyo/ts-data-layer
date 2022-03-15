import { Repository } from './repository';
import { Observable } from 'rxjs';

export function Set(target: Repository<any>, propertyKey: string, descriptor: PropertyDescriptor) {
  descriptor.value = function (...args: any) {
    console.log({
      t: this,
      args,
      target,
      propertyKey,
      descriptor,
    });
    const source = (this as any).primary;
    const primaryFun: (args: any) => Observable<any> = source[propertyKey];
    const ob = primaryFun.apply(source, args);
    return ob.pipe();
  };
}
