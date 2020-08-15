import { BankDetails } from 'src/interfaces';
export declare class RegistrationDTO {
    name: string;
    mobile: number;
    password: string;
    sponsorId: string;
}
export declare class AdminRegistrationDTO {
    name: string;
    mobile: number;
    password: string;
}
export declare class LoginDTO {
    userId: string;
    password: string;
}
export declare class UpdatePasswordDTO {
    oldPassword: string;
    newPassword: string;
}
export declare class ProfileDTO {
    name?: string;
    mobile?: number;
    panNumber?: string;
}
export declare class BankDTO implements BankDetails {
    accountName: string;
    bankName: string;
    accountNumber: number;
    isfc: string;
    accountType: string;
}
