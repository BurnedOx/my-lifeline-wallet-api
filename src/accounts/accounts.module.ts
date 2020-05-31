import { Module } from '@nestjs/common';
import { AccountsController } from './accounts.controller';
import { AccountsService } from './accounts.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/database/entity/user.entity';
import { Income } from 'src/database/entity/income.entity';
import { EPin } from 'src/database/entity/epin.entity';
import { Rank } from 'src/database/entity/rank.entity';
import { ROI } from 'src/database/entity/roi.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Income, EPin, Rank, ROI]),
  ],
  controllers: [AccountsController],
  providers: [AccountsService]
})
export class AccountsModule { }
