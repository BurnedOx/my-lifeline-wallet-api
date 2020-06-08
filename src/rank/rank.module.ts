import { Module } from '@nestjs/common';
import { RankService } from './rank.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Rank } from 'src/database/entity/rank.entity';
import { User } from 'src/database/entity/user.entity';
import { RankController } from './rank.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Rank, User])],
  providers: [RankService],
  exports: [RankService],
  controllers: [RankController]
})
export class RankModule {}
