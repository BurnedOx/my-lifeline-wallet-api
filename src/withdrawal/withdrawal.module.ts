import { Module } from '@nestjs/common';
import { WithdrawalController } from './withdrawal.controller';
import { WithdrawalService } from './withdrawal.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Withdrawal } from 'src/database/entity/withdrawal.entity';
import { User } from 'src/database/entity/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Withdrawal, User])],
  controllers: [WithdrawalController],
  providers: [WithdrawalService]
})
export class WithdrawalModule { }
