import { Module } from '@nestjs/common';
import { UserEpinService } from './user-epin.service';
import { UserEpinController } from './user-epin.controller';
import { AccountsModule } from 'src/accounts/accounts.module';
import { EpinHistoryModule } from 'src/epin-history/epin-history.module';

@Module({
  imports: [EpinHistoryModule, AccountsModule],
  providers: [UserEpinService],
  controllers: [UserEpinController],
  exports: [UserEpinService]
})
export class UserEpinModule {}
