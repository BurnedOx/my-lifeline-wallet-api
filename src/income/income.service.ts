import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Income } from 'src/database/entity/income.entity';
import { Repository, EntityManager, getManager } from 'typeorm';
import { User } from 'src/database/entity/user.entity';
import { levelIncomeAmount } from 'src/common/costraints';
import { Transaction } from 'src/database/entity/transaction.entity';

@Injectable()
export class IncomeService {
  private readonly logging = new Logger(IncomeService.name);

  async getIncomes(userId: string) {
    const user = await User.findOne(userId);
    if (!user) {
      throw new HttpException('user not found', HttpStatus.NOT_FOUND);
    }
    const incomes = await Income.find({
      where: { owner: user },
      relations: ['owner', 'from'],
    });
    return incomes.map(i => i.toResponseObject());
  }

  async removePayments(incomes: Income[], trx: EntityManager) {
    const incomesWithOwner = await Income.findByIds(
      incomes.map(i => i.id),
      { relations: ['owner'] },
    );
    for (let i of incomesWithOwner) {
      const owner = await User.findOne(i.owner.id);
      owner.balance = owner.balance - i.amount;
      await trx.save(owner);
    }
    for (let i of incomesWithOwner) {
      await trx.remove(i);
    }
  }

  async generateIncomes(userId: string) {
    try {
      const from = await User.findOne(userId, { relations: ['sponsoredBy'] });
      await getManager().transaction(async trx => {
        if (from.status === 'inactive') return;
        let level: number = 1;
        let sponsor = await trx.findOne(User, from.sponsoredBy.id, {
          relations: ['sponsoredBy'],
        });
        while (level <= 7 && sponsor.role === 'user') {
          const amount = levelIncomeAmount[level];
          sponsor.balance = sponsor.balance + amount;
          await trx.save(sponsor);
          const income = Income.create({
            owner: sponsor,
            currentBalance: sponsor.balance,
            level,
            from,
            amount,
          });
          await trx.save(income);
          const transaction = Transaction.create({
            currentBalance: sponsor.balance,
            type: 'credit',
            remarks: `From level ${level} income`,
            owner: sponsor,
            amount,
          });
          await trx.save(transaction);
          sponsor = await trx.findOne(User, sponsor.sponsoredBy.id, {
            relations: ['sponsoredBy'],
          });
          level++;
        }
      });
      this.logging.log('Distribution Successful');
    } catch (e) {
      this.logging.error('Distribution Unsuccessful', e);
    }
  }
}
