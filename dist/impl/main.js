"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImplRepository = exports.ImplDataSource = void 0;
const rxjs_1 = require("rxjs");
const repository_1 = require("../repository");
const decorators_1 = require("../decorators");
class ImplDataSource {
    constructor() {
        this.user = { name: '1', age: 0 };
    }
    getAll() {
        return (0, rxjs_1.of)(this.user);
    }
    setAll(data) {
        this.user = data;
        return this.getAll();
    }
    setAge(age) {
        this.user.age = age;
        console.log('age was set to ' + age + ' in source');
        return (0, rxjs_1.of)(this.user);
    }
}
exports.ImplDataSource = ImplDataSource;
class ImplRepository extends repository_1.Repository {
    setAge(age) {
        throw new Error();
    }
}
__decorate([
    decorators_1.Set
], ImplRepository.prototype, "setAge", null);
exports.ImplRepository = ImplRepository;
new ImplRepository({
    primary: new ImplDataSource(),
})
    .setAge(1)
    .subscribe();
//# sourceMappingURL=main.js.map