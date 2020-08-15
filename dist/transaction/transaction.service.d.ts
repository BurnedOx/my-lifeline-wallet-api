import { Repository } from 'typeorm';
import { User } from 'src/database/entity/user.entity';
import { TransactionRO } from 'src/interfaces';
import { Transaction } from 'src/database/entity/transaction.entity';
export declare class TransactionService {
    private readonly userRepo;
    private readonly trxRepo;
    constructor(userRepo: Repository<User>, trxRepo: Repository<Transaction>);
    getUserTransactions(userId: string): Promise<TransactionRO[]>;
}
