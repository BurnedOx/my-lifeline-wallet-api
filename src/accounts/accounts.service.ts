import { Injectable, HttpException, HttpStatus, Logger, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/database/entity/user.entity';
import { Repository, EntityManager, getManager, Not, IsNull } from 'typeorm';
import { RegistrationDTO, LoginDTO, AdminRegistrationDTO, SponsorUpdateDTO } from './accounts.dto';
import { generateId } from '../common/utils/generateId'
import { Income } from 'src/database/entity/income.entity';
import { EPin } from 'src/database/entity/epin.entity';
import { Rank } from 'src/database/entity/rank.entity';
import { Ranks } from 'src/common/costraints';
import { ROI } from 'src/database/entity/roi.entity';

const levelIncomeAmount = {
    1: 50,
    2: 20,
    3: 10,
    4: 5,
    5: 5
};

@Injectable()
export class AccountsService {
    constructor(
        @InjectRepository(User)
        private readonly userRepo: Repository<User>,

        @InjectRepository(EPin)
        private readonly epinRepo: Repository<EPin>,

        @InjectRepository(Income)
        private readonly incomeRepo: Repository<Income>,

        @InjectRepository(Rank)
        private readonly rankRepo: Repository<Rank>,

        @InjectRepository(ROI)
        private readonly roiRepo: Repository<ROI>,
    ) { }

    async deleteUser(id) {
        const user = await this.userRepo.findOne(id, {relations: ['generatedIncomes']});
        await this.incomeRepo.remove(user.generatedIncomes);
        await this.userRepo.remove(user);
        return 'ok';
    }

    async getAll() {
        const users = await this.userRepo.find({ relations: ['sponsoredBy', 'epin', 'ranks'] });
        return users.map(user => user.toResponseObject());
    }

    async login(data: LoginDTO) {
        const { userId, password } = data;
        const user = await this.userRepo.findOne(userId, { relations: ['sponsoredBy', 'epin', 'ranks'] });

        if (!user || !(await user.comparePassword(password))) {
            throw new HttpException('Invalid userid/password', HttpStatus.BAD_REQUEST);
        }
        return user.toResponseObject(true);
    }

    async register(data: RegistrationDTO) {
        const { name, password, mobile, sponsorId } = data;
        const sponsoredBy = await this.userRepo.findOne(sponsorId);
        if (!sponsoredBy) {
            throw new HttpException('Invalid sponspor id', HttpStatus.BAD_REQUEST);
        }
        if (sponsoredBy.status !== 'active') {
            throw new HttpException('Inactive sponsor', HttpStatus.BAD_REQUEST);
        }
        const user = await this.userRepo.create({
            id: generateId(),
            roll: 'user',
            name, password, mobile, sponsoredBy
        });
        await this.userRepo.save(user);

        return user.toResponseObject(true);
    }

    async registerAdmin(data: AdminRegistrationDTO) {
        const { name, mobile, password } = data;
        const user = await this.userRepo.create({
            id: generateId(),
            roll: 'admin',
            sponsoredBy: null,
            status: 'active',
            name, mobile, password,
        });
        await this.userRepo.save(user);
        return user.toResponseObject(true)
    }

    async activateAccount(epinId: string, userId: string) {
        let epin = await this.epinRepo.findOne(epinId, { relations: ['owner'] });

        if (!epin) {
            throw new HttpException('Invalid E-Pin', HttpStatus.NOT_FOUND);
        }
        if (epin.owner) {
            throw new HttpException('E-Pin already used', HttpStatus.BAD_REQUEST);
        }

        const user = await this.userRepo.findOne(userId, { relations: ['sponsoredBy', 'epin', 'ranks'] });

        if (!user) {
            throw new HttpException('User not found', HttpStatus.NOT_FOUND);
        }
        if (user.status === 'active') {
            throw new HttpException('User already activated', HttpStatus.BAD_REQUEST);
        }

        await getManager().transaction(async trx => {
            user.epin = epin;
            user.status = 'active';
            user.activatedAt = new Date();
            await trx.save(user);
            await this.generateIncomes(user, trx);
            await this.generateRanks(trx);
        });

        return user.toResponseObject();
    }

    async updateSponsor(data: SponsorUpdateDTO) {
        const { userId, sponsorId } = data;
        const sponsor = await this.userRepo.findOne(sponsorId);
        if (!sponsor && !(sponsor.status === 'active')) {
            throw new HttpException('Invalid Sponsor', HttpStatus.BAD_REQUEST);
        }
        const user = await this.userRepo.findOne(userId, { relations: ['generatedIncomes', 'sponsoredBy', 'epin'] });
        if (!user) {
            throw new HttpException('user not found', HttpStatus.NOT_FOUND);
        }

        await getManager().transaction(async trx => {
            user.sponsoredBy = sponsor;
            await trx.save(user);
            await this.removePayments(user.generatedIncomes, trx);
            await this.generateIncomes(user, trx);
        });

        return user.toResponseObject();
    }

    private async totalSingleLeg(user: User) {
        if (user.activatedAt === null) return 0;
        const members = await this.userRepo.find({ where: { activatedAt: Not(IsNull()) } });
        return members.filter(m => m.activatedAt.getTime() > user.activatedAt.getTime()).length;
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

    private async generateRanks(trx: EntityManager) {
        const allUsers = await this.userRepo.find({ where: { activatedAt: Not(IsNull()) } });
        for (let user of allUsers) {
            const singleLeg = await this.totalSingleLeg(user);
            const direct = await this.getDirectMembersForRank(user);
            const existingRanks = await this.rankRepo.find({ where: { owner: user }, relations: ['owner'] });
            const existingRankNames = existingRanks.map(r => r.rank);
            const rank = this.getRank(singleLeg, direct.length);
            if (rank && !(existingRankNames.includes(rank.type))) {
                const newRank = await this.rankRepo.create({
                    id: generateId(),
                    rank: rank.type,
                    owner: user, direct
                });
                await trx.save(newRank);
                user.balance = user.balance + rank.income;
                await trx.save(user);
                const roi = await this.roiRepo.create({
                    id: generateId(),
                    credit: rank.income,
                    currentBalance: user.balance,
                    owner: user,
                    rank: newRank
                });
                await trx.save(roi);
            }
        }
    }

    private async removePayments(incomes: Income[], trx: EntityManager) {
        const incomesWithOwner = await this.incomeRepo.findByIds(incomes.map(i => i.id), { relations: ['owner'] });
        for (let i of incomesWithOwner) {
            const owner = await this.userRepo.findOne(i.owner.id);
            owner.balance = owner.balance - i.amount;
            await trx.save(owner);
        }
        for (let i of incomesWithOwner) {
            await trx.remove(i);
        }
    }

    private async generateIncomes(from: User, trx: EntityManager) {
        if (from.status === 'inactive') return;
        let level: number = 1;
        let sponsor: User = await this.userRepo.findOne(from.sponsoredBy.id, { relations: ['sponsoredBy'] });
        while (level <= 5 && sponsor.roll === 'user') {
            sponsor.balance = sponsor.balance + levelIncomeAmount[level];
            await trx.save(sponsor);
            const income = await this.incomeRepo.create({
                id: generateId(),
                amount: levelIncomeAmount[level],
                owner: sponsor,
                level, from
            });
            await trx.save(income);
            sponsor = await this.userRepo.findOne(sponsor.sponsoredBy.id, { relations: ['sponsoredBy'] });
            level++;
        }
    }
}
