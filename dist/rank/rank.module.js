"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RankModule = void 0;
const common_1 = require("@nestjs/common");
const rank_service_1 = require("./rank.service");
const typeorm_1 = require("@nestjs/typeorm");
const rank_entity_1 = require("../database/entity/rank.entity");
const user_entity_1 = require("../database/entity/user.entity");
const rank_controller_1 = require("./rank.controller");
const transaction_entity_1 = require("../database/entity/transaction.entity");
let RankModule = (() => {
    let RankModule = class RankModule {
    };
    RankModule = __decorate([
        common_1.Module({
            imports: [
                typeorm_1.TypeOrmModule.forFeature([rank_entity_1.Rank, user_entity_1.User, transaction_entity_1.Transaction])
            ],
            providers: [rank_service_1.RankService],
            exports: [rank_service_1.RankService],
            controllers: [rank_controller_1.RankController]
        })
    ], RankModule);
    return RankModule;
})();
exports.RankModule = RankModule;
//# sourceMappingURL=rank.module.js.map