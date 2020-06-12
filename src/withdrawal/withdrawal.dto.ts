import { IsNumber, Min, Max } from "class-validator";

export class WithdrawalDTO {
    @IsNumber()
    @Min(500)
    @Max(500)
    withdrawAmount: number;
}