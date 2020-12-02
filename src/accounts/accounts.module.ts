import { Module } from '@nestjs/common';
import { AccountsController } from './accounts.controller';
import { AccountsService } from './accounts.service';
import { IncomeModule } from 'src/income/income.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtAuthGuard } from 'src/common/guards/jwt.guard';
import { JwtStrategy } from 'src/common/guards/jwt.strategy';
import { AWSHandler } from 'src/common/aws/aws';
import { BullModule } from '@nestjs/bull';
import { AccountProcessor } from './accounts.processor';

@Module({
  imports: [
    IncomeModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('SECRET'),
        signOptions: {expiresIn: '10000s'}
      })
    }),
    BullModule.registerQueue({
      name: 'account',
      redis: {
        host: process.env.REDIS_HOST,
        port: parseInt(process.env.REDIS_PORT),
      },
    }),
  ],
  controllers: [AccountsController],
  providers: [AccountsService, JwtAuthGuard, JwtStrategy, AWSHandler, AccountProcessor],
  exports: [AccountsService]
})
export class AccountsModule { }
