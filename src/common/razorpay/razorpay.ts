import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { customAlphabet } from 'nanoid';
import Razorpay = require('razorpay');
import { RazorpayResponse } from 'src/interfaces';

@Injectable()
export class RazorpayHandler {
    private readonly razorpay = new Razorpay({
        key_id: this.configService.get('RAZORPAY_KEY_ID'),
        key_secret: this.configService.get('RAZORPAY_KEY_SECRET')
    });

    private generateId = customAlphabet('1234567890' + 'ABCDEFGHIJKLMNOPQRSTUVWXYZ' + 'abcdefghijklmnopqrstuvwxyz', 16);

    constructor(private readonly configService: ConfigService) { }

    createOrder(amount: number): Promise<RazorpayResponse> {
        const options = {
            amount: amount * 100,
            currency: 'INR',
            receipt: this.generateId(),
            payment_capture: true,
        };
        return this.razorpay.orders.create(options);
    }
}