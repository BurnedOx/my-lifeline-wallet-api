import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository, InjectConnection } from '@nestjs/typeorm';
import { EPin } from 'src/database/entity/epin.entity';
import { Repository, getManager, EntityManager } from 'typeorm';
import { User } from 'src/database/entity/user.entity';
import { generateId } from 'src/common/utils/generateId';
import { Income } from 'src/database/entity/income.entity';

const levelIncomeAmount = {
    1: 50,
    2: 20,
    3: 10,
    4: 5,
    5: 5
};

@Injectable()
export class EpinService {
    constructor(
        @InjectRepository(EPin)
        private readonly epinRepo: Repository<EPin>,

        @InjectRepository(User)
        private readonly userRepo: Repository<User>,

        @InjectRepository(Income)
        private readonly incomeRepo: Repository<Income>
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
        const epin = await this.epinRepo.create({ id: generateId() });
        await this.epinRepo.save(epin);
        return epin.toResponseObject();
    }

    async update(epinId: string, userId: string) {
        let epin = await this.epinRepo.findOne(epinId, { relations: ['owner'] });

        if (!epin) {
            throw new HttpException('Invalid E-Pin', HttpStatus.NOT_FOUND);
        }
        if (epin.owner) {
            throw new HttpException('E-Pin already used', HttpStatus.BAD_REQUEST);
        }

        const user = await this.userRepo.findOne(userId, { relations: ['sponsoredBy', 'epin'] });

        if (!user) {
            throw new HttpException('User not found', HttpStatus.NOT_FOUND);
        }
        if (user.status === 'active') {
            throw new HttpException('User already activated', HttpStatus.BAD_REQUEST);
        }


        await this.userRepo.save(user);

        await getManager().transaction(async trx => {
            user.epin = epin;
            user.status = 'active';
            await trx.save(user);
            await this.generateIncomes(user, trx);
        });

        return user.toResponseObject();
    }

    private async generateIncomes(from: User, trx: EntityManager) {
        let level: number = 1;
        let sponsor: User = await this.userRepo.findOne(from.sponsoredBy.id, { relations: ['sponsoredBy'] });
        while (level <= 5 && sponsor.roll === 'user') {
            const income = await this.incomeRepo.create({
                id: generateId(),
                amount: levelIncomeAmount[level],
                owner: sponsor,
                level, from
            });
            sponsor.balance = sponsor.balance + levelIncomeAmount[level];
            await trx.save(income);
            await trx.save(sponsor);
            sponsor = await this.userRepo.findOne(sponsor.sponsoredBy.id, { relations: ['sponsoredBy'] });
            level++;
        }
    }
}
