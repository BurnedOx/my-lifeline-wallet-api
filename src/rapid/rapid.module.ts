import { Module } from '@nestjs/common';
import { RapidController } from './rapid.controller';
import { RapidService } from './rapid.service';

@Module({
  controllers: [RapidController],
  providers: [RapidService],
  exports: [RapidService]
})
export class RapidModule {}
