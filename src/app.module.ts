import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { AccountsModule } from './accounts/accounts.module';
import { CommonModule } from './common/common.module';
import { EpinModule } from './epin/epin.module';
import { MembersModule } from './members/members.module';
import { IncomeModule } from './income/income.module';
import { WithdrawalModule } from './withdrawal/withdrawal.module';
import { TransactionModule } from './transaction/transaction.module';
import { ConfigModule } from '@nestjs/config';
import { UserEpinModule } from './user-epin/user-epin.module';
import { EpinHistoryModule } from './epin-history/epin-history.module';
import { PaymentModule } from './payment/payment.module';
import { DashboardModule } from './dashboard/dashboard.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(),
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    AccountsModule,
    CommonModule,
    EpinModule,
    MembersModule,
    IncomeModule,
    WithdrawalModule,
    TransactionModule,
    UserEpinModule,
    EpinHistoryModule,
    PaymentModule,
    DashboardModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
