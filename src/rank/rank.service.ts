import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Rank } from 'src/database/entity/rank.entity';
import { Repository, Not, IsNull, getManager } from 'typeorm';
import { User } from 'src/database/entity/user.entity';
import { Ranks } from 'src/common/costraints';
import { RankDTO } from './rank.dto';
import { Transaction } from 'src/database/entity/transaction.entity';

@Injectable()
export class RankService {
    private readonly logging = new Logger(RankService.name);

    constructor(
        @InjectRepository(Rank)
        private readonly rankRepo: Repository<Rank>,

        @InjectRepository(User)
        private readonly userRepo: Repository<User>,

        @InjectRepository(Transaction)
        private readonly trxRepo: Repository<Transaction>
    ) { }

    async getRanks(userId: string) {
        return this.rankRepo.createQueryBuilder("rank")
            .where("rank.owner.id = :userId", { userId })
            .getRawMany();
    }

    async generateRanks(userId: string) {
        try {
            const allUsers = await this.userRepo.find({
                where: { activatedAt: Not(IsNull()), id: Not(userId) },
                relations: ['ranks'],
            });
            await getManager().transaction(async trx => {
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
        } catch (e) {
            this.logging.error('Rank generation unsuccessful', e);
        }
    }

    async createRank(data: RankDTO) {
        const { rank, ids } = data;
        const rankObj = Ranks.find(r => r.type === rank);
        const userIds = ids.split(',');

        await getManager().transaction(async trx => {
            for (let userId of userIds) {
                const user = await this.userRepo.findOne(userId, {
                    where: { activatedAt: Not(IsNull()) },
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

    private async getDirectMembersForRank(user: User) {
        return await this.userRepo.find({
            where: {
                sponsoredBy: user,
                generatedRank: IsNull(),
                activatedAt: Not(IsNull()),
            },
            relations: ['sponsoredBy', 'generatedRank'],
            order: { activatedAt: 'ASC' }
        });
    }

    private getRank(singleLegCount: number, directCount: number) {
        for (let i = 0; i < Ranks.length; i++) {
            if (directCount >= Ranks[i].direct
                && singleLegCount >= Ranks[i].company
                && (i === Ranks.length - 1 || singleLegCount < Ranks[i + 1]?.company)) {
                return { ...Ranks[i] };
            }
        }
    }
}
