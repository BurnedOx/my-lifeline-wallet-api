"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WithdrawalModule = void 0;
const common_1 = require("@nestjs/common");
const withdrawal_controller_1 = require("./withdrawal.controller");
const withdrawal_service_1 = require("./withdrawal.service");
const typeorm_1 = require("@nestjs/typeorm");
const withdrawal_entity_1 = require("../database/entity/withdrawal.entity");
const user_entity_1 = require("../database/entity/user.entity");
const transaction_entity_1 = require("../database/entity/transaction.entity");
let WithdrawalModule = (() => {
    let WithdrawalModule = class WithdrawalModule {
    };
    WithdrawalModule = __decorate([
        common_1.Module({
            imports: [typeorm_1.TypeOrmModule.forFeature([withdrawal_entity_1.Withdrawal, user_entity_1.User, transaction_entity_1.Transaction])],
            controllers: [withdrawal_controller_1.WithdrawalController],
            providers: [withdrawal_service_1.WithdrawalService]
        })
    ], WithdrawalModule);
    return WithdrawalModule;
})();
exports.WithdrawalModule = WithdrawalModule;
//# sourceMappingURL=withdrawal.module.js.map