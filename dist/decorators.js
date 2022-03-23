"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Get = exports.Set = void 0;
const rxjs_1 = require("rxjs");
/**
 * updates the value of a datasource and emits a change in the repository as long as updating the primary datasource was successful.
 * If updating the primary source was successful, the secondary sources are updated as well. Failure will throw an exception.
 * @param target
 * @param propertyKey
 * @param descriptor
 * @constructor
 */
function Set(target, propertyKey, descriptor) {
    descriptor.value = function (...args) {
        // get repository
        const obj = this;
        // get primary source and call its method (has to be the same name)
        const observable = obj.primary[propertyKey].apply(obj.primary, args);
        // TODO was passiert wenn primary ein fehler wirft? Wird switchMap dann aufgerufen?
        return observable.pipe(
        // emits change if successful
        (0, rxjs_1.tap)(res => obj._subject$.next(res)), 
        // TODO wenn error sollen die secondaries nicht geschrieben werden
        // if successful, tries updating all secondary sources
        (0, rxjs_1.switchMap)(res => {
            var _a;
            if (obj.secondary == undefined)
                return (0, rxjs_1.of)(res);
            // TODO setAll kann undefined sein
            // returns result of primary source
            return (0, rxjs_1.forkJoin)((_a = obj.secondary) === null || _a === void 0 ? void 0 : _a.map(secondary => secondary.setAll.apply(secondary, args))).pipe((0, rxjs_1.switchMap)(_ => (0, rxjs_1.of)(res)));
        }));
    };
}
exports.Set = Set;
// TODO is this needed?
function Get(target, propertyKey, descriptor) {
    descriptor.value = function (...args) {
        const obj = this;
        const observable = obj.primary[propertyKey].apply(obj.primary, args);
        // TODO was passiert wenn primary ein fehler wirft? Wird switchMap dann aufgerufen?
        return observable.pipe((0, rxjs_1.catchError)(err => {
            var _a;
            console.error(`error calling ${propertyKey}() with args ${args}`);
            const secondaryResults = (_a = obj.secondary) === null || _a === void 0 ? void 0 : _a.map((secondary) => secondary[propertyKey].apply(obj.secondary, args));
            if (secondaryResults == undefined)
                return (0, rxjs_1.of)(err);
            return (0, rxjs_1.merge)(secondaryResults).pipe((0, rxjs_1.first)());
        }));
    };
}
exports.Get = Get;
//# sourceMappingURL=decorators.js.map