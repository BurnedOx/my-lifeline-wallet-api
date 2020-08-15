import { TransactionService } from './transaction.service';
import { HeaderDTO } from 'src/common/dto/base-header.dto';
export declare class TransactionController {
    private readonly transactionService;
    constructor(transactionService: TransactionService);
    getMyTransactions(headers: HeaderDTO): Promise<import("../interfaces").TransactionRO[]>;
    getTransactionsById(id: string): Promise<import("../interfaces").TransactionRO[]>;
}
