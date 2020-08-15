import { TransactionRO } from "src/interfaces";
import { Base } from "./base.entity";
import { User } from "./user.entity";
export declare class Transaction extends Base {
    amount: number;
    currentBalance: number;
    type: 'credit' | 'debit';
    remarks: string;
    owner: User;
    get responseObj(): TransactionRO;
}
