import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './database/entity/user.entity';
import { Sponsor } from './database/entity/sponsor.entity';
const { DATABASE_URL, DATABASE_PORT, DATABASE_USER, DATABASE_PASS, DATABASE_NAME } = process.env;

@Module({
  imports: [TypeOrmModule.forRoot({
    type: "postgres",
    host: DATABASE_URL,
    port: parseInt(DATABASE_PORT),
    username: DATABASE_USER,
    password: DATABASE_PASS,
    database: DATABASE_NAME,
    synchronize: true,
    logging: true,
    entities: [User, Sponsor]
  })],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
