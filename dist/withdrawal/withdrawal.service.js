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
exports.WithdrawalService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const user_entity_1 = require("../database/entity/user.entity");
const typeorm_2 = require("typeorm");
const withdrawal_entity_1 = require("../database/entity/withdrawal.entity");
const transaction_entity_1 = require("../database/entity/transaction.entity");
let WithdrawalService = (() => {
    let WithdrawalService = class WithdrawalService {
        constructor(userRepo, withdrawlRepo, trxRepo) {
            this.userRepo = userRepo;
            this.withdrawlRepo = withdrawlRepo;
            this.trxRepo = trxRepo;
        }
        async get(userId) {
            const owner = await this.getUser(userId);
            const withdrawls = await this.withdrawlRepo.find({ where: { owner, status: typeorm_2.Not('cancelled') } });
            return withdrawls.map(w => w.toResponseObject());
        }
        async getAll(status) {
            let withdrawals;
            if (status) {
                withdrawals = await this.withdrawlRepo.find({ where: { status }, relations: ['owner'] });
            }
            else {
                withdrawals = await this.withdrawlRepo.find({ relations: ['owner'] });
            }
            return withdrawals.map(w => (Object.assign(Object.assign({}, w.toResponseObject()), { fromId: w.owner.id, fromName: w.owner.name })));
        }
        async create(userId, data) {
            const owner = await this.getUser(userId);
            const { bankDetails } = owner;
            const { withdrawAmount } = data;
            const [morning, noon] = this.getTimes();
            if (owner.balance < withdrawAmount) {
                throw new common_1.HttpException('not enough balance', common_1.HttpStatus.BAD_REQUEST);
            }
            const lastRequest = await this.withdrawlRepo.find({
                where: { owner, status: typeorm_2.Not('cancelled'), createdAt: typeorm_2.Between(morning, noon) },
                relations: ['owner']
            });
            if (lastRequest.length > 0) {
                throw new common_1.HttpException('not more than one request per day', common_1.HttpStatus.BAD_REQUEST);
            }
            const indiaTime = new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" });
            const now = new Date(indiaTime);
            if (!(now.getTime() >= morning.getTime() && now.getTime() <= noon.getTime())) {
                throw new common_1.HttpException('incorrect time to request', common_1.HttpStatus.BAD_REQUEST);
            }
            return typeorm_2.getManager().transaction(async (trx) => {
                const newWithdrawl = await this.withdrawlRepo.create({
                    netAmount: owner.balance - withdrawAmount,
                    withdrawAmount, owner, bankDetails
                });
                await trx.save(newWithdrawl);
                owner.balance = newWithdrawl.netAmount;
                await trx.save(owner);
                return newWithdrawl.toResponseObject();
            });
        }
        async update(id, status) {
            const withdrawl = await this.withdrawlRepo.findOne(id, { relations: ['owner'] });
            const { owner } = withdrawl;
            if (withdrawl.status === 'cancelled') {
                throw new common_1.HttpException('request cancelled', common_1.HttpStatus.BAD_REQUEST);
            }
            return typeorm_2.getManager().transaction(async (trx) => {
                withdrawl.status = status;
                await trx.save(withdrawl);
                if (status === 'cancelled') {
                    owner.balance = owner.balance + withdrawl.withdrawAmount;
                    await trx.save(owner);
                }
                if (status === 'paid') {
                    const transaction = this.trxRepo.create({
                        amount: withdrawl.withdrawAmount,
                        currentBalance: withdrawl.netAmount,
                        type: 'debit',
                        remarks: 'Withdrawal Payment',
                        owner
                    });
                    await trx.save(transaction);
                }
                return 'ok';
            });
        }
        async payMultiple(ids) {
            const withdrawals = await this.withdrawlRepo.findByIds(ids.split(','), { relations: ['owner'] });
            return typeorm_2.getManager().transaction(async (trx) => {
                for (let withdrawal of withdrawals) {
                    const { owner } = withdrawal;
                    if (withdrawal.status === 'cancelled') {
                        throw new common_1.HttpException(`${withdrawal.id} already canceled`, common_1.HttpStatus.BAD_REQUEST);
                    }
                    withdrawal.status = 'paid';
                    await trx.save(withdrawal);
                    const transaction = this.trxRepo.create({
                        amount: withdrawal.withdrawAmount,
                        currentBalance: withdrawal.netAmount,
                        type: 'debit',
                        remarks: 'Withdrawal Payment',
                        owner
                    });
                    await trx.save(transaction);
                }
                return 'ok';
            });
        }
        async unpayMultiple(ids) {
            const withdrawals = await this.withdrawlRepo.findByIds(ids.split(','));
            return typeorm_2.getManager().transaction(async (trx) => {
                for (let withdrawal of withdrawals) {
                    if (withdrawal.status === 'cancelled') {
                        throw new common_1.HttpException(`${withdrawal.id} already canceled`, common_1.HttpStatus.BAD_REQUEST);
                    }
                    withdrawal.status = 'unpaid';
                    await trx.save(withdrawal);
                }
                return 'ok';
            });
        }
        async cancelMultiple(ids) {
            const withdrawals = await this.withdrawlRepo.findByIds(ids.split(','), { relations: ['owner'] });
            return typeorm_2.getManager().transaction(async (trx) => {
                for (let withdrawal of withdrawals) {
                    if (withdrawal.status === 'cancelled') {
                        throw new common_1.HttpException(`${withdrawal.id} already canceled`, common_1.HttpStatus.BAD_REQUEST);
                    }
                    const { owner } = withdrawal;
                    owner.balance = owner.balance + withdrawal.withdrawAmount;
                    await trx.save(owner);
                    withdrawal.status = 'cancelled';
                    await trx.save(withdrawal);
                }
                return 'ok';
            });
        }
        async getUser(userId) {
            const user = await this.userRepo.findOne(userId);
            if (!user) {
                throw new common_1.HttpException('user not found', common_1.HttpStatus.NOT_FOUND);
            }
            return user;
        }
        getTimes() {
            const indiaTime = new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" });
            const morning = new Date(indiaTime);
            morning.setHours(9);
            morning.setMinutes(0);
            morning.setSeconds(0);
            morning.setMilliseconds(0);
            const noon = new Date(morning);
            noon.setHours(14);
            return [morning, noon];
        }
    };
    WithdrawalService = __decorate([
        common_1.Injectable(),
        __param(0, typeorm_1.InjectRepository(user_entity_1.User)),
        __param(1, typeorm_1.InjectRepository(withdrawal_entity_1.Withdrawal)),
        __param(2, typeorm_1.InjectRepository(transaction_entity_1.Transaction)),
        __metadata("design:paramtypes", [typeorm_2.Repository,
            typeorm_2.Repository,
            typeorm_2.Repository])
    ], WithdrawalService);
    return WithdrawalService;
})();
exports.WithdrawalService = WithdrawalService;
//# sourceMappingURL=withdrawal.service.js.map