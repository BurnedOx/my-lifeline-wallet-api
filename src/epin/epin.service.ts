import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EPin } from 'src/database/entity/epin.entity';
import { Repository } from 'typeorm';
import { User } from 'src/database/entity/user.entity';
import { PagingQueryDTO } from '@common/dto/paging-query.dto';
import { EpinRO } from 'src/interfaces';

@Injectable()
export class EpinService {
  constructor(
    @InjectRepository(EPin)
    private readonly epinRepo: Repository<EPin>,

    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async getAll(
    query: PagingQueryDTO,
    status?: 'used' | 'unused',
  ): Promise<[EpinRO[], number]> {
    let epins: EPin[];

    if (status === 'used') {
      epins = await EPin.getUsed(query);
    } else if (status === 'unused') {
      epins = await EPin.getUnused(query);
    } else {
      epins = await EPin.getAll(query);
    }
    return [epins.map(e => e.toResponseObject()), epins.length];
  }

  async getEpin(userId: string) {
    const user = await this.userRepo.findOne(userId);
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    const epins = await this.epinRepo.find({ relations: ['owner'] });
    const epin = epins.find(e => e.owner?.id === user.id);
    if (!epin) {
      throw new HttpException('Invalid E-Pin', HttpStatus.NOT_FOUND);
    }
    return epin.toResponseObject();
  }

  async generate() {
    const epin = await this.epinRepo.create();
    await this.epinRepo.save(epin);
    return epin.toResponseObject();
  }
}
