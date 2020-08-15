import { Base } from "./base.entity";
import { RankName } from "src/interfaces";
import { User } from "./user.entity";
export declare class Rank extends Base {
    rank: RankName;
    income: number;
    owner: User;
    direct: User[];
}
