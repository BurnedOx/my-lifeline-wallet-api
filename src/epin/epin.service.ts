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

    async getAll(status?: 'used' | 'unused') {
        let epins: EPin[];

        if (status === 'used') {
            epins = await EPin.getUsed();
        } else if (status === 'unused') {
            epins = await EPin.getUnused();
        } else {
            epins = await EPin.getAll();
        }
        return epins.map(e => e.toResponseObject());
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
