import { IsNumber, Min, Max, IsDivisibleBy } from "class-validator";

export class WithdrawalDTO {
    @IsNumber()
    @Min(200)
    @Max(3000)
    @IsDivisibleBy(100)
    withdrawAmount: number;
}