import { Module } from '@nestjs/common';
import { EpinHistoryController } from './epin-history.controller';
import { EpinHistoryService } from './epin-history.service';

@Module({
  controllers: [EpinHistoryController],
  providers: [EpinHistoryService],
  exports: [EpinHistoryService]
})
export class EpinHistoryModule {}
