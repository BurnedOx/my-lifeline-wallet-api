import { Base } from "./base.entity";
import { BankDetails, UserRO, MemberRO, SingleLegMemberRO } from "src/interfaces";
import { EPin } from "./epin.entity";
import { Income } from "./income.entity";
import { Rank } from "./rank.entity";
import { Withdrawal } from "./withdrawal.entity";
import { Transaction } from "./transaction.entity";
export declare class User extends Base {
    name: string;
    mobile: number;
    password: string;
    role: 'user' | 'admin';
    status: 'active' | 'inactive';
    activatedAt: Date | null;
    totalSingleLeg: number;
    bankDetails: BankDetails | null;
    panNumber: string | null;
    balance: number;
    sponsored: User[];
    sponsoredBy: User | null;
    epin: EPin | null;
    incomes: Income[];
    generatedIncomes: Income[];
    ranks: Rank[];
    generatedRank: Rank | null;
    withdrawals: Withdrawal[];
    trx: Transaction[];
    hashPassword(): Promise<void>;
    static findById(id: string): import("rxjs").Observable<User>;
    static getDownline(root: User, downline?: {
        member: User;
        level: number;
    }[], level?: number): Promise<{
        member: User;
        level: number;
    }[]>;
    toResponseObject(token?: string): UserRO;
    toMemberObject(level: number): MemberRO;
    toSingleLegMemberObject(): SingleLegMemberRO;
    comparePassword(attempt: string): Promise<boolean>;
}
