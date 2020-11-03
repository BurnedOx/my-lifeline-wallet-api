import { IsNumber, Min } from "class-validator";

export class EpinPurchaseDTO {
    @IsNumber()
    @Min(1)
    count: number;
}