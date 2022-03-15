"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Repository = void 0;
const rxjs_1 = require("rxjs");
class Repository {
    constructor(sources) {
        var _a, _b, _c;
        this._subject$ = new rxjs_1.ReplaySubject(!((_a = sources.cache) === null || _a === void 0 ? void 0 : _a.enabled) ? 0 : 1, (_c = (_b = sources.cache) === null || _b === void 0 ? void 0 : _b.ttl) !== null && _c !== void 0 ? _c : Infinity);
        this._sources = sources;
        this.primary = sources.primary;
        this.secondary = sources.secondary;
    }
}
exports.Repository = Repository;
//# sourceMappingURL=repository.js.map