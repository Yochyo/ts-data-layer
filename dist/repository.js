"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Repository = void 0;
const rxjs_1 = require("rxjs");
const decorators_1 = require("./decorators");
class Repository {
    constructor(sources) {
        var _a, _b, _c;
        this._subject$ = new rxjs_1.ReplaySubject(!((_a = sources.cache) === null || _a === void 0 ? void 0 : _a.enabled) ? 0 : 1, (_c = (_b = sources.cache) === null || _b === void 0 ? void 0 : _b.ttl) !== null && _c !== void 0 ? _c : Infinity);
        this._sources = sources;
        this.primary = sources.primary;
        this.secondary = sources.secondary;
    }
    setAge(age) {
        throw new Error();
    }
    get subject$() {
        this.isCacheEmpty().pipe((0, rxjs_1.startWith)((0, rxjs_1.tap)()));
        return this._subject$.pipe();
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
    //   // TODO check that main.ts source is always first
    // }
    // private _shouldUpdate = () => this._sources.
    get() {
        var _a, _b;
        return (0, rxjs_1.concat)(this.primary.getAll(), ...((_b = (_a = this.secondary) === null || _a === void 0 ? void 0 : _a.map(it => it.getAll())) !== null && _b !== void 0 ? _b : [])).pipe((0, rxjs_1.first)());
    }
    isCacheEmpty() {
        return this._subject$.pipe((0, rxjs_1.map)(_ => false), (0, rxjs_1.startWith)(true));
    }
}
__decorate([
    decorators_1.Set
], Repository.prototype, "setAge", null);
exports.Repository = Repository;
//# sourceMappingURL=repository.js.map