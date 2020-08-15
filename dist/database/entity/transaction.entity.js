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
exports.Transaction = void 0;
const typeorm_1 = require("typeorm");
const base_entity_1 = require("./base.entity");
const user_entity_1 = require("./user.entity");
let Transaction = (() => {
    let Transaction = class Transaction extends base_entity_1.Base {
        get responseObj() {
            const { id, amount, currentBalance, type, remarks, createdAt } = this;
            return {
                credit: type === 'credit' ? amount : undefined,
                debit: type === 'debit' ? amount : undefined,
                currentBalance, remarks, createdAt, id
            };
        }
    };
    __decorate([
        typeorm_1.Column(),
        __metadata("design:type", Number)
    ], Transaction.prototype, "amount", void 0);
    __decorate([
        typeorm_1.Column(),
        __metadata("design:type", Number)
    ], Transaction.prototype, "currentBalance", void 0);
    __decorate([
        typeorm_1.Column(),
        __metadata("design:type", String)
    ], Transaction.prototype, "type", void 0);
    __decorate([
        typeorm_1.Column(),
        __metadata("design:type", String)
    ], Transaction.prototype, "remarks", void 0);
    __decorate([
        typeorm_1.ManyToOne(() => user_entity_1.User, user => user.trx, { onDelete: 'CASCADE' }),
        typeorm_1.JoinColumn(),
        __metadata("design:type", user_entity_1.User)
    ], Transaction.prototype, "owner", void 0);
    Transaction = __decorate([
        typeorm_1.Entity()
    ], Transaction);
    return Transaction;
})();
exports.Transaction = Transaction;
//# sourceMappingURL=transaction.entity.js.map