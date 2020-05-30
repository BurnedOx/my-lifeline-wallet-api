import { Injectable, HttpException, HttpStatus, Logger, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/database/entity/user.entity';
import { Repository, EntityManager, getManager } from 'typeorm';
import { RegistrationDTO, LoginDTO, AdminRegistrationDTO, SponsorUpdateDTO } from './accounts.dto';
import { generateId } from '../common/utils/generateId'
import { Income } from 'src/database/entity/income.entity';
import { EPin } from 'src/database/entity/epin.entity';
import { AwsSnsService } from 'src/aws/services/aws.sns.service';

const levelIncomeAmount = {
    1: 50,
    2: 20,
    3: 10,
    4: 5,
    5: 5
};

@Injectable()
export class AccountsService {
    constructor(
        @InjectRepository(User)
        private readonly userRepo: Repository<User>,

        @InjectRepository(EPin)
        private readonly epinRepo: Repository<EPin>,

        @InjectRepository(Income)
        private readonly incomeRepo: Repository<Income>,

        private readonly smsService: AwsSnsService,
    ) { }

    async getAll() {
        const users = await this.userRepo.find({ relations: ['sponsoredBy', 'epin'] });
        return users.map(user => user.toResponseObject());
    }

    async login(data: LoginDTO) {
        const { userId, password } = data;
        const user = await this.userRepo.findOne(userId, { relations: ['sponsoredBy', 'epin'] });

        if (!user || !(await user.comparePassword(password))) {
            throw new HttpException('Invalid userid/password', HttpStatus.BAD_REQUEST);
        }
        return user.toResponseObject(true);
    }

    async register(data: RegistrationDTO) {
        const { name, password, mobile, sponsorId } = data;
        const sponsoredBy = await this.userRepo.findOne(sponsorId);
        if (!sponsoredBy) {
            throw new HttpException('Invalid sponspor id', HttpStatus.BAD_REQUEST);
        }
        if (sponsoredBy.status !== 'active') {
            throw new HttpException('Inactive sponsor', HttpStatus.BAD_REQUEST);
        }
        const user = await this.userRepo.create({
            id: generateId(),
            roll: 'user',
            name, password, mobile, sponsoredBy
        });
        await this.userRepo.save(user);

        this.smsService.sendSMS({
            Message: `
                From VIAZON,\n
                Official site: www.viazon.co\n
                Name: ${user.name}\n
                User Id: ${user.id}\n
                Password: ${data.password}
            `,
            Subject: 'Your Viazon Credentials',
            PhoneNumber: `+91${user.mobile}`
        });

        return user.toResponseObject(true);
    }

    async registerAdmin(data: AdminRegistrationDTO) {
        const { name, mobile, password } = data;
        const user = await this.userRepo.create({
            id: generateId(),
            roll: 'admin',
            sponsoredBy: null,
            status: 'active',
            name, mobile, password,
        });
        await this.userRepo.save(user);
        return user.toResponseObject(true)
    }

    async activateAccount(epinId: string, userId: string) {
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

    async updateSponsor(data: SponsorUpdateDTO) {
        const { userId, sponsorId } = data;
        const sponsor = await this.userRepo.findOne(sponsorId);
        if (!sponsor && !(sponsor.status === 'active')) {
            throw new HttpException('Invalid Sponsor', HttpStatus.BAD_REQUEST);
        }
        const user = await this.userRepo.findOne(userId, { relations: ['generatedIncomes', 'sponsoredBy', 'epin'] });
        if (!user) {
            throw new HttpException('user not found', HttpStatus.NOT_FOUND);
        }

        await getManager().transaction(async trx => {
            user.sponsoredBy = sponsor;
            await trx.save(user);
            await this.removePayments(user.generatedIncomes, trx);
            await this.generateIncomes(user, trx);
        });

        return user.toResponseObject();
    }

    private async removePayments(incomes: Income[], trx: EntityManager) {
        const incomesWithOwner = await this.incomeRepo.findByIds(incomes.map(i => i.id), { relations: ['owner'] });
        for (let i of incomesWithOwner) {
            const owner = await this.userRepo.findOne(i.owner.id);
            owner.balance = owner.balance - i.amount;
            await trx.save(owner);
        }
        for (let i of incomesWithOwner) {
            await trx.remove(i);
        }
    }

    private async generateIncomes(from: User, trx: EntityManager) {
        if (from.status === 'inactive') return;
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
