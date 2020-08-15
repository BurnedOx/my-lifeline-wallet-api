import { User } from 'src/database/entity/user.entity';
import { Repository } from 'typeorm';
import { Withdrawal } from 'src/database/entity/withdrawal.entity';
import { WithdrawalDTO } from './withdrawal.dto';
import { Transaction } from 'src/database/entity/transaction.entity';
export declare class WithdrawalService {
    private readonly userRepo;
    private readonly withdrawlRepo;
    private readonly trxRepo;
    constructor(userRepo: Repository<User>, withdrawlRepo: Repository<Withdrawal>, trxRepo: Repository<Transaction>);
    get(userId: string): Promise<import("../interfaces").WithdrawalRO[]>;
    getAll(status?: 'paid' | 'unpaid' | 'cancelled'): Promise<{
        fromId: string;
        fromName: string;
        id: string;
        withdrawAmount: number;
        netAmount: number;
        processedAt: Date;
        paymentType: string;
        status: "paid" | "unpaid" | "cancelled";
        createdAt: Date;
        updatedAt: Date;
        accountName: string;
        bankName: string;
        accountNumber: number;
        isfc: string;
        accountType: string;
    }[]>;
    create(userId: string, data: WithdrawalDTO): Promise<import("../interfaces").WithdrawalRO>;
    update(id: string, status: 'paid' | 'unpaid' | 'cancelled'): Promise<string>;
    payMultiple(ids: string): Promise<string>;
    unpayMultiple(ids: string): Promise<string>;
    cancelMultiple(ids: string): Promise<string>;
    private getUser;
    private getTimes;
}
