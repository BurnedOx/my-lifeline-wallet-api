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
    bankDetails: BankDetails | null;
    panNumber: number | null;
    roll: 'user' | 'admin';
    status: 'active' | 'inactive';
    updatedAt: Date;
    createdAt: Date;
    token?: string;
}