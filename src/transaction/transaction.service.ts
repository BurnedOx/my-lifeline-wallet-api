import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from 'src/database/entity/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { TransactionRO } from 'src/interfaces';
import { Transaction } from 'src/database/entity/transaction.entity';
import { PagingQueryDTO } from '@common/dto/paging-query.dto';

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,

    @InjectRepository(Transaction)
    private readonly trxRepo: Repository<Transaction>,
  ) {}

  async getUserTransactions(
    userId: string,
    query: PagingQueryDTO,
  ): Promise<[TransactionRO[], number]> {
    const owner = await this.userRepo.findOne(userId);
    if (!owner) {
      throw new HttpException('user not found', HttpStatus.NOT_FOUND);
    }
    const [trx, total] = await this.trxRepo.findAndCount({
      where: { owner },
      order: { createdAt: 'DESC', currentBalance: 'DESC' },
      take: query.limit,
      skip: query.offset,
    });

    return [trx.map(t => t.responseObj), total];
  }
}
