import { Base } from "./base.entity";
import { User } from "./user.entity";
import { WithdrawalRO, BankDetails } from "src/interfaces";
export declare class Withdrawal extends Base {
    withdrawAmount: number;
    netAmount: number;
    processedAt: Date | null;
    paymentType: string;
    bankDetails: BankDetails | null;
    status: 'paid' | 'unpaid' | 'cancelled';
    owner: User;
    toResponseObject(): WithdrawalRO;
}
