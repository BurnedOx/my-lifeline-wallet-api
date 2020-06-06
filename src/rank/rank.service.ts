import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Rank } from 'src/database/entity/rank.entity';
import { Repository, EntityManager, Not, IsNull, getManager } from 'typeorm';
import { User } from 'src/database/entity/user.entity';
import { generateId } from 'src/common/utils/generateId';
import { Ranks } from 'src/common/costraints';

@Injectable()
export class RankService {
    private readonly logging = new Logger(RankService.name);

    constructor(
        @InjectRepository(Rank)
        private readonly rankRepo: Repository<Rank>,

        @InjectRepository(User)
        private readonly userRepo: Repository<User>,
    ) { }

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
                    const direct = await this.getDirectMembersForRank(user);
                    const existingRanks = user.ranks;
                    const existingRankNames = existingRanks.map(r => r.rank);
                    const rank = this.getRank(user.totalSingleLeg, direct.length);
                    if (rank && !(existingRankNames.includes(rank.type))) {
                        const newRank = this.rankRepo.create({
                            id: generateId(),
                            rank: rank.type,
                            owner: user, direct
                        });
                        await trx.save(newRank);
                    }
                }
            });
            this.logging.log('Rank generation successful');
        } catch (e) {
            this.logging.error('Rank generation unsuccessful', e);
        }
    }

    private async getDirectMembersForRank(user: User) {
        return await this.userRepo.find({
            where: {
                sponsoredBy: user,
                generatedRank: IsNull()
            },
            relations: ['sponsoredBy', 'generatedRank']
        });
    }

    private getRank(singleLegCount: number, directCount: number) {
        for (let i = 0; i < Ranks.length; i++) {
            if (directCount === Ranks[i].direct
                && singleLegCount >= Ranks[i].company
                && (i === Ranks.length - 1 || singleLegCount < Ranks[i + 1]?.company)) {
                return { ...Ranks[i] };
            }
        }
    }
}
