import { Type } from "class-transformer";
import { IsDate, IsNumber, IsString } from "class-validator";

export class CreateTaskDTO {
    @IsString()
    userId: string;

    @IsDate()
    @Type(() => Date)
    dueDate: Date;

    @IsNumber()
    amount: number;
}