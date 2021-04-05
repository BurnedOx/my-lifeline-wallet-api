import { Module } from '@nestjs/common';
import { AccountsModule } from 'src/accounts/accounts.module';
import { PaytmHandler } from 'src/common/paytm/paytm';
import { UserEpinModule } from 'src/user-epin/user-epin.module';
import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';

@Module({
  imports: [AccountsModule, UserEpinModule],
  controllers: [PaymentController],
  providers: [PaymentService, PaytmHandler]
})
export class PaymentModule {}
