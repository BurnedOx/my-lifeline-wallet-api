import { IsString, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

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

export class SponsorUpdateDTO {
    @IsString()
    userId: string;

    @IsString()
    sponsorId: string;
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