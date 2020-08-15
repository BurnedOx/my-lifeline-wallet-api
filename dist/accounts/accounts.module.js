"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccountsModule = void 0;
const common_1 = require("@nestjs/common");
const accounts_controller_1 = require("./accounts.controller");
const accounts_service_1 = require("./accounts.service");
const typeorm_1 = require("@nestjs/typeorm");
const user_entity_1 = require("../database/entity/user.entity");
const epin_entity_1 = require("../database/entity/epin.entity");
const rank_module_1 = require("../rank/rank.module");
const income_module_1 = require("../income/income.module");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
const jwt_guard_1 = require("../common/guards/jwt.guard");
const jwt_strategy_1 = require("../common/guards/jwt.strategy");
const aws_1 = require("../common/aws/aws");
let AccountsModule = (() => {
    let AccountsModule = class AccountsModule {
    };
    AccountsModule = __decorate([
        common_1.Module({
            imports: [
                typeorm_1.TypeOrmModule.forFeature([user_entity_1.User, epin_entity_1.EPin]),
                rank_module_1.RankModule,
                income_module_1.IncomeModule,
                jwt_1.JwtModule.registerAsync({
                    imports: [config_1.ConfigModule],
                    inject: [config_1.ConfigService],
                    useFactory: async (configService) => ({
                        secret: configService.get('SECRET'),
                        signOptions: { expiresIn: '10000s' }
                    })
                })
            ],
            controllers: [accounts_controller_1.AccountsController],
            providers: [accounts_service_1.AccountsService, jwt_guard_1.JwtAuthGuard, jwt_strategy_1.JwtStrategy, aws_1.AWSHandler]
        })
    ], AccountsModule);
    return AccountsModule;
})();
exports.AccountsModule = AccountsModule;
//# sourceMappingURL=accounts.module.js.map