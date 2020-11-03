import { IsNumber, IsString, Max, Min } from "class-validator";

export class SendEPinDTO {
    @IsString()
    sendTo: string;

    @IsNumber()
    @Min(1)
    total: number;
}

export class RedeemEPinDTO {
    @IsNumber()
    @Min(1)
    @Max(4)
    count: number;
}