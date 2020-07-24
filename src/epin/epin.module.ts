import { forwardRef, Module } from '@nestjs/common';
import { EpinController } from './epin.controller';
import { EpinService } from './epin.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EPin } from 'src/database/entity/epin.entity';
import { User } from 'src/database/entity/user.entity';
import { AccountsModule } from 'src/accounts/accounts.module';

@Module({
  imports: [
    forwardRef(() => AccountsModule),
    TypeOrmModule.forFeature([EPin, User])
  ],
  controllers: [EpinController],
  providers: [EpinService]
})
export class EpinModule {}
