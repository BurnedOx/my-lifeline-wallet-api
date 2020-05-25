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
    bankDetails: BankDetails | null;
    panNumber: number | null;
    roll: 'user' | 'admin';
    status: 'active' | 'inactive';
    activatedAt: Date | null;
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

export interface EpinRO {
    id: string;
    owner: Pick<UserRO, 'id' | 'name'> | null;
    updatedAt: Date;
    createdAt: Date;
}