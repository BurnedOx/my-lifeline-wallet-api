import { Module } from '@nestjs/common';
import { AccountsController } from './accounts.controller';
import { AccountsService } from './accounts.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/database/entity/user.entity';
import { EPin } from 'src/database/entity/epin.entity';
import { IncomeModule } from 'src/income/income.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtAuthGuard } from 'src/common/guards/jwt.guard';
import { JwtStrategy } from 'src/common/guards/jwt.strategy';
import { AWSHandler } from 'src/common/aws/aws';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, EPin]),
    IncomeModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('SECRET'),
        signOptions: { expiresIn: '10000s' },
      }),
    }),
  ],
  controllers: [AccountsController],
  providers: [AccountsService, JwtAuthGuard, JwtStrategy, AWSHandler],
  exports: [AccountsService],
})
export class AccountsModule {}
