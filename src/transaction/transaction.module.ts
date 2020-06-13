import { Module } from '@nestjs/common';
import { TransactionController } from './transaction.controller';
import { TransactionService } from './transaction.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/database/entity/user.entity';
import { Income } from 'src/database/entity/income.entity';
import { ROI } from 'src/database/entity/roi.entity';
import { Withdrawal } from 'src/database/entity/withdrawal.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Income, ROI, Withdrawal])],
  controllers: [TransactionController],
  providers: [TransactionService]
})
export class TransactionModule { }
