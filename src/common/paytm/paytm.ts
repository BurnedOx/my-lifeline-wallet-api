import { Injectable } from '@nestjs/common';
import * as Paytm from 'paytm-pg-node-sdk';
import { nanoid } from 'nanoid';
import { User } from 'src/database/entity/user.entity';

@Injectable()
export class PaytmHandler {
  private readonly environment = Paytm.LibraryConstants.STAGING_ENVIRONMENT;
  private readonly mid = process.env.PAYTM_MID;
  private readonly key = process.env.PAYTM_M_KEY;
  private readonly website = process.env.PAYTM_WEBSITE;
  private readonly client_id = process.env.PAYTM_CHANNEL_ID;

  constructor() {
    Paytm.MerchantProperties.initialize(
      this.environment,
      this.mid,
      this.key,
      this.client_id,
    );
  }

  async pay(user: User, amount: number) {
    const channelId = Paytm.EChannelId.WEB;
    const orderId = nanoid();
    const trxAmount = Paytm.Money.constructWithCurrencyAndValue(
      Paytm.EnumCurrency.INR,
      `${amount}.00`,
    );
    const userInfo = new Paytm.UserInfo(user.id);
    const [firstName, lastName] = user.name.split(' ');
    
    userInfo.setFirstName(firstName);
    userInfo.setLastName(lastName);
    userInfo.setMobile(user.mobile.toString());

    const paymentDetailBuilder = new Paytm.PaymentDetailBuilder(channelId, orderId, trxAmount, userInfo);
    const paymentDetail = paymentDetailBuilder.build();
    const response = await Paytm.Payment.createTxnToken(paymentDetail);

    return {...response, amount, orderId};
  }
}
