import { StringSplit } from "@common/transform/string-split";
import { Type } from "class-transformer";
import { ArrayMinSize, IsDate, IsNumber, IsString } from "class-validator";

export class CreateTaskDTO {
    @ArrayMinSize(1)
    @StringSplit()
    ids: string[];

    @IsDate()
    @Type(() => Date)
    dueDate: Date;

    @IsNumber()
    amount: number;
}