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
exports.RankService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const rank_entity_1 = require("../database/entity/rank.entity");
const typeorm_2 = require("typeorm");
const user_entity_1 = require("../database/entity/user.entity");
const costraints_1 = require("../common/costraints");
const transaction_entity_1 = require("../database/entity/transaction.entity");
let RankService = (() => {
    var RankService_1;
    let RankService = RankService_1 = class RankService {
        constructor(rankRepo, userRepo, trxRepo) {
            this.rankRepo = rankRepo;
            this.userRepo = userRepo;
            this.trxRepo = trxRepo;
            this.logging = new common_1.Logger(RankService_1.name);
        }
        async getRanks(userId) {
            return this.rankRepo.createQueryBuilder("rank")
                .where("rank.owner.id = :userId", { userId })
                .getMany();
        }
        async generateRanks(userId) {
            try {
                const allUsers = await this.userRepo.find({
                    where: { activatedAt: typeorm_2.Not(typeorm_2.IsNull()), id: typeorm_2.Not(userId) },
                    relations: ['ranks'],
                });
                await typeorm_2.getManager().transaction(async (trx) => {
                    for (let user of allUsers) {
                        user.totalSingleLeg += 1;
                        await trx.save(user);
                        let direct = await this.getDirectMembersForRank(user);
                        const existingRanks = user.ranks;
                        const existingRankNames = existingRanks.map(r => r.rank);
                        const rank = this.getRank(user.totalSingleLeg, direct.length);
                        if (rank && !(existingRankNames.includes(rank.type))) {
                            direct = direct.slice(0, rank.direct);
                            user = await this.userRepo.findOne(user.id);
                            const newRank = this.rankRepo.create({
                                rank: rank.type,
                                income: rank.income,
                                owner: user, direct
                            });
                            await trx.save(newRank);
                            user.balance += rank.income;
                            await trx.save(user);
                            const transaction = this.trxRepo.create({
                                amount: rank.income,
                                currentBalance: user.balance,
                                type: 'credit',
                                remarks: `From ${rank.type} generation`,
                                owner: user
                            });
                            await trx.save(transaction);
                        }
                    }
                });
                this.logging.log('Rank generation successful');
            }
            catch (e) {
                this.logging.error('Rank generation unsuccessful', e);
            }
        }
        async createRank(data) {
            const { rank, ids } = data;
            const rankObj = costraints_1.Ranks.find(r => r.type === rank);
            const userIds = ids.split(',');
            await typeorm_2.getManager().transaction(async (trx) => {
                for (let userId of userIds) {
                    const user = await this.userRepo.findOne(userId, {
                        where: { activatedAt: typeorm_2.Not(typeorm_2.IsNull()) },
                        relations: ['ranks']
                    });
                    const existingRankNames = user.ranks.map(r => r.rank);
                    const direct = (await this.getDirectMembersForRank(user)).slice(0, rankObj.direct);
                    if (user && !(existingRankNames.includes(rank))) {
                        const newRank = await this.rankRepo.create({
                            owner: user,
                            income: rankObj.income,
                            rank, direct
                        });
                        await trx.save(newRank);
                        user.balance += rankObj.income;
                        await trx.save(user);
                        const transaction = this.trxRepo.create({
                            amount: rankObj.income,
                            currentBalance: user.balance,
                            type: 'credit',
                            remarks: `From ${rank} generation`,
                            owner: user
                        });
                        await trx.save(transaction);
                    }
                }
            });
            return 'ok';
        }
        async getDirectMembersForRank(user) {
            return await this.userRepo.find({
                where: {
                    sponsoredBy: user,
                    generatedRank: typeorm_2.IsNull(),
                    activatedAt: typeorm_2.Not(typeorm_2.IsNull()),
                },
                relations: ['sponsoredBy', 'generatedRank'],
                order: { activatedAt: 'ASC' }
            });
        }
        getRank(singleLegCount, directCount) {
            var _a;
            for (let i = 0; i < costraints_1.Ranks.length; i++) {
                if (directCount >= costraints_1.Ranks[i].direct
                    && singleLegCount >= costraints_1.Ranks[i].company
                    && (i === costraints_1.Ranks.length - 1 || singleLegCount < ((_a = costraints_1.Ranks[i + 1]) === null || _a === void 0 ? void 0 : _a.company))) {
                    return Object.assign({}, costraints_1.Ranks[i]);
                }
            }
        }
    };
    RankService = RankService_1 = __decorate([
        common_1.Injectable(),
        __param(0, typeorm_1.InjectRepository(rank_entity_1.Rank)),
        __param(1, typeorm_1.InjectRepository(user_entity_1.User)),
        __param(2, typeorm_1.InjectRepository(transaction_entity_1.Transaction)),
        __metadata("design:paramtypes", [typeorm_2.Repository,
            typeorm_2.Repository,
            typeorm_2.Repository])
    ], RankService);
    return RankService;
})();
exports.RankService = RankService;
//# sourceMappingURL=rank.service.js.map