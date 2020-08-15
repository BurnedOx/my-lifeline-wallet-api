import { Base } from "./base.entity";
import { User } from "./user.entity";
import { EpinRO } from "src/interfaces";
export declare class EPin extends Base {
    owner: User | null;
    static getAll(): Promise<EPin[]>;
    static getUsed(): Promise<EPin[]>;
    static getUnused(): Promise<EPin[]>;
    toResponseObject(): EpinRO;
}
