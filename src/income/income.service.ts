import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Income } from 'src/database/entity/income.entity';
import { Repository, EntityManager } from 'typeorm';
import { User } from 'src/database/entity/user.entity';
import { levelIncomeAmount } from 'src/common/costraints';

@Injectable()
export class IncomeService {
    constructor(
        @InjectRepository(Income)
        private readonly incomeRepo: Repository<Income>,

        @InjectRepository(User)
        private readonly userRepo: Repository<User>
    ) {}

    async getIncomes(userId: string) {
        const user = await this.userRepo.findOne(userId);
        if (!user) {
            throw new HttpException('user not found', HttpStatus.NOT_FOUND);
        }
        const incomes = await this.incomeRepo.find({where: {owner: user}, relations: ['owner', 'from']});
        return incomes.map(i => i.toResponseObject());
    }

    async removePayments(incomes: Income[], trx: EntityManager) {
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

    async generateIncomes(from: User, trx: EntityManager) {
        if (from.status === 'inactive') return;
        let level: number = 1;
        let sponsor: User = await this.userRepo.findOne(from.sponsoredBy.id, { relations: ['sponsoredBy'] });
        while (level <= 5 && sponsor.roll === 'user') {
            sponsor.balance = sponsor.balance + levelIncomeAmount[level];
            await trx.save(sponsor);
            const income = this.incomeRepo.create({
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
