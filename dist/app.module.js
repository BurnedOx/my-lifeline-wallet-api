"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const typeorm_1 = require("@nestjs/typeorm");
const schedule_1 = require("@nestjs/schedule");
const accounts_module_1 = require("./accounts/accounts.module");
const common_module_1 = require("./common/common.module");
const epin_module_1 = require("./epin/epin.module");
const members_module_1 = require("./members/members.module");
const income_module_1 = require("./income/income.module");
const rank_module_1 = require("./rank/rank.module");
const withdrawal_module_1 = require("./withdrawal/withdrawal.module");
const transaction_module_1 = require("./transaction/transaction.module");
const config_1 = require("@nestjs/config");
let AppModule = (() => {
    let AppModule = class AppModule {
    };
    AppModule = __decorate([
        common_1.Module({
            imports: [
                typeorm_1.TypeOrmModule.forRoot(),
                schedule_1.ScheduleModule.forRoot(),
                config_1.ConfigModule.forRoot({
                    isGlobal: true,
                    envFilePath: '.env'
                }),
                accounts_module_1.AccountsModule, common_module_1.CommonModule, epin_module_1.EpinModule, members_module_1.MembersModule, income_module_1.IncomeModule, rank_module_1.RankModule, withdrawal_module_1.WithdrawalModule, transaction_module_1.TransactionModule
            ],
            controllers: [app_controller_1.AppController],
            providers: [app_service_1.AppService],
        })
    ], AppModule);
    return AppModule;
})();
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map