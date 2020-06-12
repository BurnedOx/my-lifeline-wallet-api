import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EPin } from 'src/database/entity/epin.entity';
import { Repository } from 'typeorm';
import { User } from 'src/database/entity/user.entity';

@Injectable()
export class EpinService {
    constructor(
        @InjectRepository(EPin)
        private readonly epinRepo: Repository<EPin>,

        @InjectRepository(User)
        private readonly userRepo: Repository<User>,
    ) { }

    async getAll() {
        const epins = await this.epinRepo.find({ relations: ['owner'] });
        return epins.map(e => e.toResponseObject());
    }

    async getAllUsable() {
        const epins = await this.getAll();
        return epins.filter(e => e.owner === null);
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
