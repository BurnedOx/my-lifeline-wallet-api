import { Module } from '@nestjs/common';
import { AccountsController } from './accounts.controller';
import { AccountsService } from './accounts.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/database/entity/user.entity';
import { EPin } from 'src/database/entity/epin.entity';
import { RankModule } from 'src/rank/rank.module';
import { IncomeModule } from 'src/income/income.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, EPin]),
    RankModule,
    IncomeModule
  ],
  controllers: [AccountsController],
  providers: [AccountsService]
})
export class AccountsModule { }
