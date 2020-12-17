import { StringSplit } from "@common/transform/string-split";
import { Type } from "class-transformer";
import { ArrayMaxSize, IsDate, IsNumber, IsString } from "class-validator";

export class CreateTaskDTO {
    @ArrayMaxSize(20,)
    @StringSplit()
    ids: string[];

    @IsDate()
    @Type(() => Date)
    dueDate: Date;

    @IsNumber()
    amount: number;
}