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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const user_entity_1 = require("../database/entity/user.entity");
const typeorm_2 = require("@nestjs/typeorm");
const transaction_entity_1 = require("../database/entity/transaction.entity");
let TransactionService = (() => {
    let TransactionService = class TransactionService {
        constructor(userRepo, trxRepo) {
            this.userRepo = userRepo;
            this.trxRepo = trxRepo;
        }
        async getUserTransactions(userId) {
            const owner = await this.userRepo.findOne(userId);
            if (!owner) {
                throw new common_1.HttpException('user not found', common_1.HttpStatus.NOT_FOUND);
            }
            const trx = (await this.trxRepo.find({ where: { owner } })).map(t => t.responseObj);
            return [...trx].sort((a, b) => (b.createdAt.getTime() - a.createdAt.getTime()));
        }
    };
    TransactionService = __decorate([
        common_1.Injectable(),
        __param(0, typeorm_2.InjectRepository(user_entity_1.User)),
        __param(1, typeorm_2.InjectRepository(transaction_entity_1.Transaction)),
        __metadata("design:paramtypes", [typeorm_1.Repository,
            typeorm_1.Repository])
    ], TransactionService);
    return TransactionService;
})();
exports.TransactionService = TransactionService;
//# sourceMappingURL=transaction.service.js.map