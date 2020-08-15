"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Income = void 0;
const typeorm_1 = require("typeorm");
const base_entity_1 = require("./base.entity");
const user_entity_1 = require("./user.entity");
let Income = (() => {
    let Income = class Income extends base_entity_1.Base {
        toResponseObject() {
            const { id, level, amount, currentBalance, owner, from, createdAt } = this;
            return {
                id, level, amount, currentBalance, createdAt,
                ownerId: owner.id,
                from: { id: from.id, name: from.name }
            };
        }
    };
    __decorate([
        typeorm_1.Column(),
        __metadata("design:type", Number)
    ], Income.prototype, "level", void 0);
    __decorate([
        typeorm_1.Column(),
        __metadata("design:type", Number)
    ], Income.prototype, "amount", void 0);
    __decorate([
        typeorm_1.Column({ default: 0 }),
        __metadata("design:type", Number)
    ], Income.prototype, "currentBalance", void 0);
    __decorate([
        typeorm_1.ManyToOne(() => user_entity_1.User, user => user.incomes, { onDelete: 'CASCADE' }),
        typeorm_1.JoinColumn(),
        __metadata("design:type", user_entity_1.User)
    ], Income.prototype, "owner", void 0);
    __decorate([
        typeorm_1.ManyToOne(() => user_entity_1.User, user => user.generatedIncomes, { onDelete: 'CASCADE' }),
        typeorm_1.JoinColumn(),
        __metadata("design:type", user_entity_1.User)
    ], Income.prototype, "from", void 0);
    Income = __decorate([
        typeorm_1.Entity()
    ], Income);
    return Income;
})();
exports.Income = Income;
//# sourceMappingURL=income.entity.js.map