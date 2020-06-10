import { Module } from '@nestjs/common';
import { WithdrawlController } from './withdrawl.controller';
import { WithdrawlService } from './withdrawl.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Withdrawl } from 'src/database/entity/withdrawl.entity';
import { User } from 'src/database/entity/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Withdrawl, User])],
  controllers: [WithdrawlController],
  providers: [WithdrawlService]
})
export class WithdrawlModule { }
