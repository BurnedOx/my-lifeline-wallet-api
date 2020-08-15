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
exports.Withdrawal = void 0;
const typeorm_1 = require("typeorm");
const base_entity_1 = require("./base.entity");
const user_entity_1 = require("./user.entity");
let Withdrawal = (() => {
    let Withdrawal = class Withdrawal extends base_entity_1.Base {
        toResponseObject() {
            const { id, withdrawAmount, netAmount, processedAt, paymentType, status, bankDetails, createdAt, updatedAt } = this;
            return Object.assign({ id, withdrawAmount, netAmount, processedAt, paymentType, status, createdAt, updatedAt }, bankDetails);
        }
    };
    __decorate([
        typeorm_1.Column(),
        __metadata("design:type", Number)
    ], Withdrawal.prototype, "withdrawAmount", void 0);
    __decorate([
        typeorm_1.Column(),
        __metadata("design:type", Number)
    ], Withdrawal.prototype, "netAmount", void 0);
    __decorate([
        typeorm_1.Column({ nullable: true, default: null }),
        __metadata("design:type", Date)
    ], Withdrawal.prototype, "processedAt", void 0);
    __decorate([
        typeorm_1.Column({ default: 'By NEFT' }),
        __metadata("design:type", String)
    ], Withdrawal.prototype, "paymentType", void 0);
    __decorate([
        typeorm_1.Column({ type: 'jsonb', nullable: true, default: null }),
        __metadata("design:type", Object)
    ], Withdrawal.prototype, "bankDetails", void 0);
    __decorate([
        typeorm_1.Column({ default: 'unpaid' }),
        __metadata("design:type", String)
    ], Withdrawal.prototype, "status", void 0);
    __decorate([
        typeorm_1.ManyToOne(() => user_entity_1.User, user => user.withdrawals, { onDelete: 'CASCADE' }),
        typeorm_1.JoinColumn(),
        __metadata("design:type", user_entity_1.User)
    ], Withdrawal.prototype, "owner", void 0);
    Withdrawal = __decorate([
        typeorm_1.Entity()
    ], Withdrawal);
    return Withdrawal;
})();
exports.Withdrawal = Withdrawal;
//# sourceMappingURL=withdrawal.entity.js.map