import {Type} from "class-transformer";
import {IsNumber} from "class-validator";

export class PagingQuery {
    @IsNumber()
    @Type(() => Number)
    limit: number = 10;

    @IsNumber()
    @Type(() => Number)
    offset: number = 0;
}