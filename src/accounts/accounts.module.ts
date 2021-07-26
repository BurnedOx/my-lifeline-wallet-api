import { Module } from '@nestjs/common';
import { AccountsController } from './accounts.controller';
import { AccountsService } from './accounts.service';
import { IncomeModule } from 'src/income/income.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtAuthGuard } from 'src/common/guards/jwt.guard';
import { JwtStrategy } from 'src/common/guards/jwt.strategy';
import { BullModule } from '@nestjs/bull';
import { AccountProcessor } from './accounts.processor';
import { TwilioHandler } from '@common/twilio/twilio';

@Module({
  imports: [
    IncomeModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('SECRET'),
        signOptions: { expiresIn: '10000s' },
      }),
    }),
    // BullModule.registerQueueAsync({
    //   name: 'account',
    //   imports: [ConfigModule],
    //   inject: [ConfigService],
    //   useFactory: async (configService: ConfigService) => ({
    //     name: 'account',
    //     redis: configService.get('REDIS_URL'),
    //   }),
    // }),
  ],
  controllers: [AccountsController],
  providers: [
    AccountsService,
    JwtAuthGuard,
    JwtStrategy,
    TwilioHandler,
    // AccountProcessor,
  ],
  exports: [AccountsService],
})
export class AccountsModule {}
