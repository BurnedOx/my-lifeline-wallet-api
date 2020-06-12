import { Injectable, HttpException, HttpStatus, Logger, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/database/entity/user.entity';
import { Repository, getManager } from 'typeorm';
import { RegistrationDTO, LoginDTO, AdminRegistrationDTO, SponsorUpdateDTO, UpdatePasswordDTO, ProfileDTO, BankDTO } from './accounts.dto';
import { EPin } from 'src/database/entity/epin.entity';
import { RankService } from 'src/rank/rank.service';
import { IncomeService } from 'src/income/income.service';
import * as bcrypct from 'bcryptjs';

@Injectable()
export class AccountsService {
    constructor(
        @InjectRepository(User)
        private readonly userRepo: Repository<User>,

        @InjectRepository(EPin)
        private readonly epinRepo: Repository<EPin>,

        private readonly incomeService: IncomeService,

        private readonly rankService: RankService,
    ) { }

    async getAll() {
        const users = await this.userRepo.find({ relations: ['sponsoredBy', 'epin', 'ranks'] });
        return users.map(user => user.toResponseObject());
    }

    async login(data: LoginDTO) {
        const { userId, password } = data;
        const user = await this.userRepo.findOne(userId, { relations: ['sponsoredBy', 'epin', 'ranks'] });

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
            roll: 'user',
            name, password, mobile, sponsoredBy
        });
        await this.userRepo.save(user);

        return user.toResponseObject(true);
    }

    async registerAdmin(data: AdminRegistrationDTO) {
        const { name, mobile, password } = data;
        const user = await this.userRepo.create({
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

        const user = await this.userRepo.findOne(userId, { relations: ['sponsoredBy', 'epin', 'ranks'] });

        if (!user) {
            throw new HttpException('User not found', HttpStatus.NOT_FOUND);
        }
        if (user.status === 'active') {
            throw new HttpException('User already activated', HttpStatus.BAD_REQUEST);
        }

        await getManager().transaction(async trx => {
            user.epin = epin;
            user.status = 'active';
            user.activatedAt = new Date();
            await trx.save(user);
            await this.incomeService.generateIncomes(user, trx);
        });

        this.rankService.generateRanks(user.id);

        return user.toResponseObject();
    }

    async updateProfile(data: ProfileDTO, userId: string) {
        const user = await this.userRepo.update(userId, data);
        if (user.affected > 0) {
            return 'ok';
        } else {
            throw new HttpException('Update Failed', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async updatePassword(data: UpdatePasswordDTO, userId: string) {
        const { oldPassword, newPassword } = data;
        const user = await this.userRepo.findOne(userId);

        if (!user || !(await user.comparePassword(oldPassword))) {
            throw new HttpException('Invalid password', HttpStatus.BAD_REQUEST);
        }

        user.password = await bcrypct.hash(newPassword, 10);
        await this.userRepo.save(user);

        return 'ok';
    }

    async updateBankDetails(data: BankDTO, userId: string) {
        const user = await this.userRepo.update(userId, { bankDetails: data });
        if (user.affected > 0) {
            return 'ok';
        } else {
            throw new HttpException('Update Failed', HttpStatus.INTERNAL_SERVER_ERROR);
        }
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
            await this.incomeService.removePayments(user.generatedIncomes, trx);
            await this.incomeService.generateIncomes(user, trx);
        });

        return user.toResponseObject();
    }

    async resetBalance() {
        const users = await this.userRepo.find();
        await getManager().transaction(async trx => {
            for (let user of users) {
                user.balance = 0;
                await trx.save(user);
            }
        });
        return 'ok';
    }
}
