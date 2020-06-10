import { IsNumber, Min, Max } from "class-validator";

export class WithdrawlDTO {
    @IsNumber()
    @Min(500)
    @Max(500)
    withdrawAmount: number;
}