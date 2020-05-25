import { Module } from '@nestjs/common';
import { IncomeController } from './income.controller';
import { IncomeService } from './income.service';

@Module({
  controllers: [IncomeController],
  providers: [IncomeService]
})
export class IncomeModule {}
