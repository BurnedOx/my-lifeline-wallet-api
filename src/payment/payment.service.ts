import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { AccountsService } from 'src/accounts/accounts.service';
import { RazorpayHandler } from 'src/common/razorpay/razorpay';
import { User } from 'src/database/entity/user.entity';
import * as crypto from 'crypto';
import { ConfigService } from '@nestjs/config';
import { EPin } from 'src/database/entity/epin.entity';
import { EPIN_PRICE } from 'src/common/costraints';
import { UserEpinService } from 'src/user-epin/user-epin.service';

@Injectable()
export class PaymentService {
    constructor(
        private readonly accountService: AccountsService,
        private readonly userEpinService: UserEpinService,
        private readonly configService: ConfigService,
        private readonly razorpay: RazorpayHandler,
    ) { }

    async payForActivation(userId: string) {
        const { name, mobile } = await this.getUser(userId);

        try {
            const res = await this.razorpay.createOrder(EPIN_PRICE);
            return {
                ...res, name, mobile,
                notes: {
                    userId,
                    for: "activation"
                }
            }
        } catch (e) {
            throw new HttpException(e.error?.description, e.statusCode);
        }
    }

    async payForEpins(userId: string, count: number) {
        const { name, mobile } = await this.getUser(userId);

        try {
            const res = await this.razorpay.createOrder(EPIN_PRICE * count);
            return {
                ...res, name, mobile,
                notes: {
                    userId, count,
                    for: "epin_purchase"
                }
            }
        } catch (e) {
            throw new HttpException(e.error?.description, e.statusCode);
        }
    }

    async verifyPayment(razorpaySignature: string, data: any) {
        const shasum = crypto.createHmac('sha256', this.configService.get('SECRET'));
        shasum.update(JSON.stringify(data));
        const digest = shasum.digest('hex');

        if (digest !== razorpaySignature) {
            throw new HttpException('Payment verification failed', HttpStatus.BAD_REQUEST);
        }

        const { notes } = data.payload.payment.entity;

        switch (notes.for) {
            case "activation":
                await this.activateAccount(notes.userId);
                break;
            case "epin_purchase":
                await this.userEpinService.purchaseEpins(notes.userId, notes.count);
                break;
        }

        return 'ok';
    }

    private async activateAccount(userId: string) {
        const epin = EPin.create();
        await epin.save();
        await this.accountService.activateAccount(epin.id, userId);
    }

    private async getUser(userId: string) {
        const user = await User.findOne(userId);
        if (!user) {
            throw new HttpException('User id not found', HttpStatus.NOT_FOUND);
        }
        return user;
    }
}
