import { Income } from 'src/database/entity/income.entity';
import { Repository, EntityManager } from 'typeorm';
import { User } from 'src/database/entity/user.entity';
import { Transaction } from 'src/database/entity/transaction.entity';
export declare class IncomeService {
    private readonly incomeRepo;
    private readonly userRepo;
    private readonly trxRepo;
    constructor(incomeRepo: Repository<Income>, userRepo: Repository<User>, trxRepo: Repository<Transaction>);
    getIncomes(userId: string): Promise<import("../interfaces").IncomeRO[]>;
    removePayments(incomes: Income[], trx: EntityManager): Promise<void>;
    generateIncomes(from: User, trx: EntityManager): Promise<void>;
}
