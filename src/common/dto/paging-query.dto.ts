import {Type} from "class-transformer";
import {IsString} from "class-validator";

export class PagingQuery {
    @IsString()
    limit: string;

    @IsString()
    offset: string;

    public get l() {
        return this.limit ? parseInt(this.limit) : 10;
    }

    public get o() {
        return this.offset ? parseInt(this.offset) : 0;
    }
}