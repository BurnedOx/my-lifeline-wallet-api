import { Module } from '@nestjs/common';
import { RoiController } from './roi.controller';
import { RoiService } from './roi.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ROI } from 'src/database/entity/roi.entity';
import { User } from 'src/database/entity/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ROI, User])],
  controllers: [RoiController],
  providers: [RoiService]
})
export class RoiModule {}
