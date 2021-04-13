import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { Income } from 'src/database/entity/income.entity';
import { EntityManager, getManager } from 'typeorm';
import { User } from 'src/database/entity/user.entity';
import { levelIncomeAmount } from 'src/common/costraints';
import { Transaction } from 'src/database/entity/transaction.entity';
import { PagingQueryDTO } from '@common/dto/paging-query.dto';
import { IncomeRO } from 'src/interfaces';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class IncomeService {
  private readonly logging = new Logger(IncomeService.name);

  async getIncomes(
    userId: string,
    query: PagingQueryDTO,
  ): Promise<[IncomeRO[], number]> {
    const user = await User.findOne(userId);
    if (!user) {
      throw new HttpException('user not found', HttpStatus.NOT_FOUND);
    }
    const [incomes, total] = await Income.findAndCount({
      where: { owner: user },
      relations: ['owner', 'from'],
      order: { createdAt: 'DESC' },
      take: query.limit,
      skip: query.offset,
    });
    return [incomes.map(i => i.toResponseObject()), total];
  }

  async removePayments(incomes: Income[], trx: EntityManager) {
    const incomesWithOwner = await Income.findByIds(
      incomes.map(i => i.id),
      { relations: ['owner'] },
    );
    for (const i of incomesWithOwner) {
      const owner = await User.findOne(i.owner.id);
      owner.balance = `${parseFloat(owner.balance) - parseFloat(i.amount)}`;
      await trx.save(owner);
    }
    for (const i of incomesWithOwner) {
      await trx.remove(i);
    }
  }

  async generateIncomes(userId: string) {
    try {
      const from = await User.findOne(userId, { relations: ['sponsoredBy'] });
      await getManager().transaction(async trx => {
        if (from.status === 'inactive') return;
        let level = 1;
        let sponsor: User = await User.findOne(from.sponsoredBy.id, { relations: ['sponsoredBy'] });
        while (level <= 5 && sponsor.role === 'user') {
          const amount = `${levelIncomeAmount[level]}`;

          sponsor.balance = `${parseFloat(sponsor.balance) + amount}`;
          await trx.save(sponsor);

          const income = Income.create({
            owner: sponsor,
            level,
            from,
            amount,
          });
          await trx.save(income);

          const transaction = Transaction.create({
            currentBalance: sponsor.balance,
            type: 'credit',
            remarks: `From level ${income.level} income`,
            owner: sponsor,
            amount: `${amount}`,
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

  // @Cron('0 0 * * 1-5', { timeZone: 'Asia/Kolkata' })
  // generateTrx() {
  //   return getManager().transaction(async trx => {
  //     try {
  //       const incomes = await Income.getToBePaid();
  //       for (const income of incomes) {
  //         const amount = parseFloat(income.amount) / 20;
  //         const owner = await trx.findOne(User, income.owner.id);
  //
  //         owner.balance = `${parseFloat(owner.balance) + amount}`;
  //         trx.save(owner);
  //
  //         const transaction = Transaction.create({
  //           currentBalance: owner.balance,
  //           type: 'credit',
  //           remarks: `From level ${income.level} income`,
  //           owner: owner,
  //           amount: `${amount}`,
  //         });
  //         await trx.save(transaction);
  //       }
  //       this.logging.log('Successfully generated income trx');
  //     } catch (e) {
  //       this.logging.error(e);
  //     }
  //   });
  // }
}
