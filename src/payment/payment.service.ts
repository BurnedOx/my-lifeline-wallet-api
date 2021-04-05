import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { AccountsService } from 'src/accounts/accounts.service';
import { EPIN_PRICE } from 'src/common/costraints';
import { PaytmHandler } from 'src/common/paytm/paytm';
import { OrderType, Payment } from 'src/database/entity/payment.entity';
import { User } from 'src/database/entity/user.entity';
import { UserEpinService } from 'src/user-epin/user-epin.service';

@Injectable()
export class PaymentService {
  private readonly logger = new Logger(PaymentService.name);

  constructor(
    private readonly accountService: AccountsService,
    private readonly userEpinService: UserEpinService,
    private readonly paytm: PaytmHandler,
  ) {}

  async payForActivation(userId: string) {
    const owner = await this.getUser(userId);
    const res = await this.paytm.pay(owner, EPIN_PRICE);

    const signature: string = res.responseObject.head.signature;
    const txnToken: string = res.responseObject.body.txnToken;
    const id: string = res.orderId;
    const amount: number = res.amount;
    const extra: string = res.jsonResponse;

    const payment = await Payment.create({
      id,
      amount,
      signature,
      txnToken,
      extra,
      owner,
      orderType: OrderType.EpinPurhase,
    }).save();

    return payment.responseObj;
  }

  private async getUser(userId: string) {
    const user = await User.findOne(userId);
    if (!user) {
      throw new HttpException('User id not found', HttpStatus.NOT_FOUND);
    }
    return user;
  }
}
