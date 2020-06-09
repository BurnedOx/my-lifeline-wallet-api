export interface BankDetails {
    accountName: string;
    bankName: string;
    accountNumber: number;
    isfc: number;
    accountType: string;
}

export interface UserRO {
    id: string;
    name: string;
    mobile: number;
    sponsoredBy: Pick<UserRO, 'id' | 'name'> | null;
    epinId: string | null;
    panNumber: string | null;
    roll: 'user' | 'admin';
    status: 'active' | 'inactive';
    activatedAt: Date | null;
    rank: RankName | null;
    balance: number;
    updatedAt: Date;
    createdAt: Date;
    token?: string;
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
    updatedAt: Date;
    createdAt: Date;
}

export interface IncomeRO {
    id: string,
    ownerId: string,
    from: Pick<UserRO, 'id' | 'name'>,
    level: number,
    amount: number,
    createdAt: Date
}

export interface RoiRO {
    id: string;
    credit: number;
    currentBalance: number;
    rank: RankName;
    updatedAt: Date;
    createdAt: Date;
}

export type RankName = 'BRONZE' | 'SILVER' | 'GOLD' | 'PLATINUM' | 'EMERALD' | 'RUBY' | 'PEARL' | 'DIAMOND' | 'WHITE DIAMOND' | 'BLACK DIAMOND' | 'BLUE DIAMOND' | 'AMBASSADOR';

export interface RankData {
    type: RankName;
    direct: number;
    company: number;
    income: number;
    validity: number;
}