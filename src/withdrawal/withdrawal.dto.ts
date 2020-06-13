import { IsNumber, Min, Max } from "class-validator";

export class WithdrawalDTO {
    @IsNumber()
    @Min(50)
    @Max(50)
    withdrawAmount: number;
}