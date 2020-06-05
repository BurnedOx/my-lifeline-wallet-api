import { Module } from '@nestjs/common';
import { IncomeController } from './income.controller';
import { IncomeService } from './income.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Income } from 'src/database/entity/income.entity';
import { User } from 'src/database/entity/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Income, User])],
  controllers: [IncomeController],
  providers: [IncomeService],
  exports: [IncomeService]
})
export class IncomeModule { }
