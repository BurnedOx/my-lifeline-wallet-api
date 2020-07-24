import { forwardRef, Module } from '@nestjs/common';
import { RankService } from './rank.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Rank } from 'src/database/entity/rank.entity';
import { User } from 'src/database/entity/user.entity';
import { RankController } from './rank.controller';
import { Transaction } from 'src/database/entity/transaction.entity';
import { AccountsModule } from 'src/accounts/accounts.module';

@Module({
  imports: [
    forwardRef(() => AccountsModule),
    TypeOrmModule.forFeature([Rank, User, Transaction])
  ],
  providers: [RankService],
  exports: [RankService],
  controllers: [RankController]
})
export class RankModule {}
