import { Module } from '@nestjs/common';
import { RankService } from './rank.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Rank } from 'src/database/entity/rank.entity';
import { User } from 'src/database/entity/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Rank, User])],
  providers: [RankService],
  exports: [RankService]
})
export class RankModule {}
