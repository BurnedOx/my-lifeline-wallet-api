import { StringSplit } from "../transform/string-split";
import { ArrayMaxSize } from "class-validator";

export class ParamIds {
    @ArrayMaxSize(20,)
    @StringSplit()
    ids: string;
}
