import { IsNumber, Min, Max } from "class-validator";

export class WithdrawalDTO {
    @IsNumber()
    @Min(200)
    @Max(20000)
    withdrawAmount: number;
}