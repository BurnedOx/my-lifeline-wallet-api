import { IsNumber, Min, Max, IsDivisibleBy } from "class-validator";

export class WithdrawalDTO {
    @IsNumber()
    @Min(300)
    @Max(2000)
    @IsDivisibleBy(100)
    withdrawAmount: number;
}