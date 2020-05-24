import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountsModule } from './accounts/accounts.module';
import { CommonModule } from './common/common.module';
import { EpinModule } from './epin/epin.module';
import { MembersModule } from './members/members.module';

@Module({
  imports: [TypeOrmModule.forRoot(), AccountsModule, CommonModule, EpinModule, MembersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
