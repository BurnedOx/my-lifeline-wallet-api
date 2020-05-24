import { Module } from '@nestjs/common';
import { EpinController } from './epin.controller';
import { EpinService } from './epin.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EPin } from 'src/database/entity/epin.entity';
import { User } from 'src/database/entity/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([EPin, User])],
  controllers: [EpinController],
  providers: [EpinService]
})
export class EpinModule {}
