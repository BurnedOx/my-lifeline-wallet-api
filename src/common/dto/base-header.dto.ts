import { Expose } from "class-transformer";
import { IsString } from "class-validator";

export class HeaderDTO {
    @Expose()
    @IsString()
    "x-userid": string;

    public get userId() {
        return this['x-userid'];
    }
}

export class RazorpayHeaderDTO {
    @Expose()
    @IsString()
    "x-razorpay-signature": string;

    public get razorpaySignature() {
        return this['x-razorpay-signature'];
    }
}