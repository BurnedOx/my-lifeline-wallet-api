import { Base } from "./base.entity";
import { User } from "./user.entity";
import { IncomeRO } from "src/interfaces";
export declare class Income extends Base {
    level: number;
    amount: number;
    currentBalance: number;
    owner: User;
    from: User;
    toResponseObject(): IncomeRO;
}
