export interface BankDetails {
    accountName: string;
    bankName: string;
    accountNumber: number;
    isfc: string;
    accountType: string;
}

export interface UserRO {
    id: string;
    name: string;
    mobile: number;
    sponsoredBy: Pick<UserRO, 'id' | 'name'> | null;
    epinId: string | null;
    wallet: number;
    bankDetails: BankDetails | null;
    panNumber: string | null;
    roll: 'user' | 'admin';
    status: 'active' | 'inactive';
    activatedAt: Date | null;
    updatedAt: Date;
    createdAt: Date;
    token?: string;
}

export interface UserDetailsRO {
    wallet: number;
    rank: RankName | null;
    direct: number;
    downline: number;
    singleLeg: number;
    levelIncome: number;
    singleLegIncome: number;
    totalWithdrawal: number;
    totalIncome: number;
}

export interface MemberRO {
    id: string;
    name: string;
    level: number;
    status: 'active' | 'inactive';
    activatedAt: Date | null;
    createdAt: Date;
}

export interface SingleLegMemberRO {
    id: string;
    name: string;
    activatedAt: Date | null;
}

export interface EpinRO {
    id: string;
    owner: Pick<UserRO, 'id' | 'name'> | null;
    status: 'used' | 'unused';
    updatedAt: Date;
    createdAt: Date;
}

export interface IncomeRO {
    id: string;
    ownerId: string;
    from: Pick<UserRO, 'id' | 'name'>;
    level: number;
    amount: number;
    currentBalance: number;
    createdAt: Date;
}

export interface WithdrawalRO extends BankDetails {
    id: string;
    withdrawAmount: number;
    netAmount: number;
    processedAt: Date | null;
    paymentType: string;
    status: 'paid' | 'unpaid' | 'cancelled';
    createdAt: Date;
    updatedAt: Date;
}

export type RankName = 'RANK1' | 'RANK2' | 'RANK3' | 'RANK4' | 'RANK5' | 'RANK6' | 'RANK7' | 'RANK8' | 'RANK9' | 'RANK10';

export interface RankData {
    type: RankName;
    direct: number;
    company: number;
    income: number;
}

export interface TransactionRO {
    credit?: number;
    debit?: number;
    currentBalance: number;
    remarks: string;
    createdAt: Date;
}