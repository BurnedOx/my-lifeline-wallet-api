import { IsString, IsNotEmpty, IsNumber } from 'class-validator';

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