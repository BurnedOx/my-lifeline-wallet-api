import {Type} from "class-transformer";
import {IsNumber} from "class-validator";

export class PagingQuery {
    @IsNumber()
    limit: string;

    @IsNumber()
    offset: string;

    public get l() {
        return this.limit ? parseInt(this.limit) : 10;
    }

    public get o() {
        return this.offset ? parseInt(this.offset) : 0;
    }
}