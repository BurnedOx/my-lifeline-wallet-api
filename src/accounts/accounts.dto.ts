import { IsString, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';
import { BankDetails } from 'src/interfaces';

export class RegistrationDTO {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsNumber()
    @IsNotEmpty()
    mobile: number;

    @IsString()
    @IsNotEmpty()
    password: string;

    @IsString()
    @IsNotEmpty()
    sponsorId: string;
}

export class AdminRegistrationDTO {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsNumber()
    @IsNotEmpty()
    mobile: number;

    @IsString()
    @IsNotEmpty()
    password: string;
}

export class LoginDTO {
    @IsString()
    @IsNotEmpty()
    userId: string;

    @IsString()
    @IsNotEmpty()
    password: string;
}

export class UpdatePasswordDTO {
    @IsString()
    oldPassword: string;

    @IsString()
    newPassword: string;
}

export class ProfileDTO {
    @IsString()
    @IsOptional()
    name?: string;

    @IsNumber()
    @IsOptional()
    mobile?: number;

    @IsString()
    @IsOptional()
    panNumber?: string;
}

export class BankDTO implements BankDetails {
    @IsString()
    accountName: string;

    @IsString()
    bankName: string;

    @IsNumber()
    accountNumber: number;

    @IsString()
    isfc: string;

    @IsString()
    accountType: string;
}