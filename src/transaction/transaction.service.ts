import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from 'src/database/entity/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { TransactionRO } from 'src/interfaces';
import { Transaction } from 'src/database/entity/transaction.entity';

@Injectable()
export class TransactionService {

    constructor(
        @InjectRepository(User)
        private readonly userRepo: Repository<User>,

        @InjectRepository(Transaction)
        private readonly trxRepo: Repository<Transaction>,
    ) { }

    async getUserTransactions(userId: string): Promise<TransactionRO[]> {
        const owner = await this.userRepo.findOne(userId);
        if (!owner) {
            throw new HttpException('user not found', HttpStatus.NOT_FOUND);
        }
        const trx = (await this.trxRepo.find({ where: { owner } })).map(t => t.responseObj);

        return [...trx].sort((a, b) => (
            b.createdAt.getTime() - a.createdAt.getTime()
        ));
    }
}
