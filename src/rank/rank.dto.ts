import { IsString, IsNotEmpty } from "class-validator";
import { RankName } from "src/interfaces";

export class RankDTO {
    @IsString()
    @IsNotEmpty()
    rank: RankName;

    @IsString()
    @IsNotEmpty()
    ids: string;
}