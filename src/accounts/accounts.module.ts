import { Module } from '@nestjs/common';
import { AccountsController } from './accounts.controller';
import { AccountsService } from './accounts.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/database/entity/user.entity';
import { Income } from 'src/database/entity/income.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Income])],
  controllers: [AccountsController],
  providers: [AccountsService]
})
export class AccountsModule {}
