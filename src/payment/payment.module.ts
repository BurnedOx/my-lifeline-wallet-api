import { Module } from '@nestjs/common';
import { AccountsModule } from 'src/accounts/accounts.module';
import { RazorpayHandler } from 'src/common/razorpay/razorpay';
import { UserEpinModule } from 'src/user-epin/user-epin.module';
import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';
import {PaytmHandler} from "@common/paytm/paytm";

@Module({
  imports: [AccountsModule, UserEpinModule],
  controllers: [PaymentController],
  providers: [PaymentService, RazorpayHandler, PaytmHandler]
})
export class PaymentModule {}
