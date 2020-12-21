import { IsNumber, Min, Max } from "class-validator";

export class WithdrawalDTO {
    @IsNumber()
    @Min(300)
    @Max(20000)
    withdrawAmount: number;
}