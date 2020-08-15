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
exports.AccountsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const user_entity_1 = require("../database/entity/user.entity");
const typeorm_2 = require("typeorm");
const epin_entity_1 = require("../database/entity/epin.entity");
const rank_service_1 = require("../rank/rank.service");
const income_service_1 = require("../income/income.service");
const bcrypct = require("bcryptjs");
const costraints_1 = require("../common/costraints");
const jwt_1 = require("@nestjs/jwt");
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const aws_1 = require("../common/aws/aws");
let AccountsService = (() => {
    let AccountsService = class AccountsService {
        constructor(userRepo, epinRepo, incomeService, rankService, jwtService, aws) {
            this.userRepo = userRepo;
            this.epinRepo = epinRepo;
            this.incomeService = incomeService;
            this.rankService = rankService;
            this.jwtService = jwtService;
            this.aws = aws;
        }
        findOne(id) {
            return rxjs_1.from(this.userRepo.findOne(id, { relations: ['sponsoredBy', 'epin', 'ranks'] })).pipe(operators_1.map((user) => user === null || user === void 0 ? void 0 : user.toResponseObject()));
        }
        async getAll() {
            const users = await this.userRepo.find({ relations: ['sponsoredBy', 'epin', 'ranks'] });
            return users.map(user => user.toResponseObject());
        }
        async login(data, admin = false) {
            const { userId, password } = data;
            const user = await this.userRepo.findOne(userId, { relations: ['sponsoredBy', 'epin', 'ranks'] });
            if (!user || !(await user.comparePassword(password)) || (admin && user.role !== 'admin')) {
                throw new common_1.HttpException('Invalid userid/password', common_1.HttpStatus.BAD_REQUEST);
            }
            const token = await this.generateJWT(userId);
            return user.toResponseObject(token);
        }
        async register(data) {
            const { name, password, mobile, sponsorId } = data;
            const sponsoredBy = await this.userRepo.findOne(sponsorId);
            if (!sponsoredBy) {
                throw new common_1.HttpException('Invalid sponspor id', common_1.HttpStatus.BAD_REQUEST);
            }
            if (sponsoredBy.status !== 'active') {
                throw new common_1.HttpException('Inactive sponsor', common_1.HttpStatus.BAD_REQUEST);
            }
            const user = await this.userRepo.create({
                role: 'user',
                name, password, mobile, sponsoredBy
            });
            await this.userRepo.save(user);
            const token = await this.generateJWT(user.id);
            this.aws.sendSMS(`Wellcome to My-Lifeline-Wallet\n
            You have successfully registered\n
            Your User Id: ${user.id}\n
            Your Password: ${password}\n
            Please visit: http://my-lifeline-wallet.s3-website.us-east-2.amazonaws.com/`, `${mobile}`, 'mlwallet');
            return user.toResponseObject(token);
        }
        async getDetails(userId) {
            var _a, _b;
            const user1 = await this.userRepo.createQueryBuilder("user")
                .leftJoinAndSelect('user.sponsored', 'sponsored')
                .leftJoinAndSelect('user.ranks', 'ranks')
                .where('user.id = :userId', { userId })
                .getOne();
            if (!user1) {
                throw new common_1.HttpException('user not found', common_1.HttpStatus.NOT_FOUND);
            }
            const user2 = await this.userRepo.createQueryBuilder("user")
                .leftJoinAndSelect('user.incomes', 'incomes')
                .leftJoinAndSelect('user.withdrawals', 'withdrawals')
                .where('user.id = :userId', { userId })
                .getOne();
            const { balance: wallet, ranks, sponsored, totalSingleLeg: singleLeg } = user1;
            const { incomes, withdrawals } = user2;
            ranks === null || ranks === void 0 ? void 0 : ranks.sort((a, b) => {
                const aRank = costraints_1.Ranks.find(r => r.type === a.rank);
                const bRank = costraints_1.Ranks.find(r => r.type === b.rank);
                return (bRank.company - aRank.company);
            });
            const incomeAmounts = incomes.map(i => i.amount);
            const withdrawAmounts = withdrawals.filter(w => w.status === 'paid').map(w => w.withdrawAmount);
            const rank = ranks ? ((_b = (_a = ranks[0]) === null || _a === void 0 ? void 0 : _a.rank) !== null && _b !== void 0 ? _b : null) : null;
            const direct = sponsored.length;
            const downline = (await user_entity_1.User.getDownline(user1)).length;
            const levelIncome = incomeAmounts.length !== 0 ? incomeAmounts.reduce((a, b) => a + b) : 0;
            const singleLegIncome = ranks.length !== 0 ? ranks.map(r => r.income).reduce((a, b) => a + b) : 0;
            const totalWithdrawal = withdrawAmounts.length !== 0 ? withdrawAmounts.reduce((a, b) => a + b) : 0;
            const totalIncome = levelIncome + singleLegIncome;
            return {
                wallet, rank, direct, downline, singleLeg, levelIncome, singleLegIncome, totalWithdrawal, totalIncome
            };
        }
        async registerAdmin(data) {
            const { name, mobile, password } = data;
            const user = await this.userRepo.create({
                role: 'admin',
                sponsoredBy: null,
                status: 'active',
                name, mobile, password,
            });
            await this.userRepo.save(user);
            const token = await this.generateJWT(user.id);
            return user.toResponseObject(token);
        }
        async activateAccount(epinId, userId) {
            let epin = await this.epinRepo.findOne(epinId, { relations: ['owner'] });
            if (!epin) {
                throw new common_1.HttpException('Invalid E-Pin', common_1.HttpStatus.NOT_FOUND);
            }
            if (epin.owner) {
                throw new common_1.HttpException('E-Pin already used', common_1.HttpStatus.BAD_REQUEST);
            }
            const user = await this.userRepo.findOne(userId, { relations: ['sponsoredBy', 'epin', 'ranks'] });
            if (!user) {
                throw new common_1.HttpException('User not found', common_1.HttpStatus.NOT_FOUND);
            }
            if (user.status === 'active') {
                throw new common_1.HttpException('User already activated', common_1.HttpStatus.BAD_REQUEST);
            }
            await typeorm_2.getManager().transaction(async (trx) => {
                user.epin = epin;
                user.status = 'active';
                user.activatedAt = new Date();
                await trx.save(user);
                await this.incomeService.generateIncomes(user, trx);
            });
            this.rankService.generateRanks(user.id);
            return user.toResponseObject();
        }
        async updateProfile(data, userId) {
            const user = await this.userRepo.update(userId, data);
            if (user.affected > 0) {
                return 'ok';
            }
            else {
                throw new common_1.HttpException('Update Failed', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }
        async updatePassword(data, userId) {
            const { oldPassword, newPassword } = data;
            const user = await this.userRepo.findOne(userId);
            if (!user || !(await user.comparePassword(oldPassword))) {
                throw new common_1.HttpException('Invalid password', common_1.HttpStatus.BAD_REQUEST);
            }
            user.password = await bcrypct.hash(newPassword, 10);
            await this.userRepo.save(user);
            return 'ok';
        }
        async forgotPassword(id, newPassword) {
            const user = await this.userRepo.findOne({ id });
            if (!user) {
                throw new common_1.HttpException('User Not Found', common_1.HttpStatus.NOT_FOUND);
            }
            user.password = await bcrypct.hash(newPassword, 10);
            await this.userRepo.save(user);
            return 'ok';
        }
        async updateBankDetails(data, userId) {
            const user = await this.userRepo.update(userId, { bankDetails: data });
            if (user.affected > 0) {
                return 'ok';
            }
            else {
                throw new common_1.HttpException('Update Failed', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }
        async updateSponsor(userId, sponsorId) {
            const sponsor = await this.userRepo.findOne(sponsorId);
            if (!sponsor && !(sponsor.status === 'active')) {
                throw new common_1.HttpException('Invalid Sponsor', common_1.HttpStatus.BAD_REQUEST);
            }
            const user = await this.userRepo.findOne(userId, { relations: ['generatedIncomes', 'sponsoredBy', 'epin'] });
            if (!user) {
                throw new common_1.HttpException('user not found', common_1.HttpStatus.NOT_FOUND);
            }
            await typeorm_2.getManager().transaction(async (trx) => {
                user.sponsoredBy = sponsor;
                await trx.save(user);
                await this.incomeService.removePayments(user.generatedIncomes, trx);
                await this.incomeService.generateIncomes(user, trx);
            });
            return user.toResponseObject();
        }
        async resetBalance() {
            const users = await this.userRepo.find();
            await typeorm_2.getManager().transaction(async (trx) => {
                for (let user of users) {
                    user.balance = 0;
                    await trx.save(user);
                }
            });
            return 'ok';
        }
        async deleteUser(id) {
            await this.userRepo.delete(id);
            return 'ok';
        }
        generateJWT(userId) {
            return this.jwtService.signAsync({ userId });
        }
    };
    AccountsService = __decorate([
        common_1.Injectable(),
        __param(0, typeorm_1.InjectRepository(user_entity_1.User)),
        __param(1, typeorm_1.InjectRepository(epin_entity_1.EPin)),
        __metadata("design:paramtypes", [typeorm_2.Repository,
            typeorm_2.Repository,
            income_service_1.IncomeService,
            rank_service_1.RankService,
            jwt_1.JwtService,
            aws_1.AWSHandler])
    ], AccountsService);
    return AccountsService;
})();
exports.AccountsService = AccountsService;
//# sourceMappingURL=accounts.service.js.map