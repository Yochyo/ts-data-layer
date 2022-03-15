"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Set = void 0;
function Set(target, propertyKey, descriptor) {
    descriptor.value = function (...args) {
        console.log({
            t: this,
            args,
            target,
            propertyKey,
            descriptor,
        });
        const source = this.primary;
        const primaryFun = source[propertyKey];
        const ob = primaryFun.apply(source, args);
        return ob.pipe();
    };
}
exports.Set = Set;
//# sourceMappingURL=decorators.js.map