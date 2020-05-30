import { Module } from '@nestjs/common';
import { AccountsController } from './accounts.controller';
import { AccountsService } from './accounts.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/database/entity/user.entity';
import { Income } from 'src/database/entity/income.entity';
import { AwsModule } from 'src/aws/aws.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Income]),
    AwsModule.forRootAsync({
      useFactory: async () => ({
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        region: process.env.AWS_REGION,
      }),
      inject: [],
    }),
  ],
  controllers: [AccountsController],
  providers: [AccountsService]
})
export class AccountsModule { }
