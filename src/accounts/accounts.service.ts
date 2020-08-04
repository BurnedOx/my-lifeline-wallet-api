import { Injectable, HttpException, HttpStatus, Logger, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/database/entity/user.entity';
import { Repository, getManager } from 'typeorm';
import { RegistrationDTO, LoginDTO, AdminRegistrationDTO, UpdatePasswordDTO, ProfileDTO, BankDTO } from './accounts.dto';
import { EPin } from 'src/database/entity/epin.entity';
import { RankService } from 'src/rank/rank.service';
import { IncomeService } from 'src/income/income.service';
import * as bcrypct from 'bcryptjs';
import { UserDetailsRO, UserRO } from 'src/interfaces';
import { Ranks } from 'src/common/costraints';
import { JwtService } from '@nestjs/jwt';
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class AccountsService {
    constructor(
        @InjectRepository(User)
        private readonly userRepo: Repository<User>,

        @InjectRepository(EPin)
        private readonly epinRepo: Repository<EPin>,

        private readonly incomeService: IncomeService,

        private readonly rankService: RankService,

        private readonly jwtService: JwtService,
    ) { }

    findOne(id: string): Observable<UserRO> {
        return from(this.userRepo.findOne(id, { relations: ['sponsoredBy', 'epin', 'ranks'] })).pipe(
            map((user) => user?.toResponseObject())
        )
    }

    async getAll() {
        const users = await this.userRepo.find({ relations: ['sponsoredBy', 'epin', 'ranks'] });
        return users.map(user => user.toResponseObject());
    }

    async login(data: LoginDTO, admin: boolean = false) {
        const { userId, password } = data;
        const user = await this.userRepo.findOne(userId, { relations: ['sponsoredBy', 'epin', 'ranks'] });

        if (!user || !(await user.comparePassword(password)) || (admin && user.role !== 'admin')) {
            throw new HttpException('Invalid userid/password', HttpStatus.BAD_REQUEST);
        }
        const token = await this.generateJWT(userId);
        return user.toResponseObject(token);
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
            role: 'user',
            name, password, mobile, sponsoredBy
        });
        await this.userRepo.save(user);
        const token = await this.generateJWT(user.id);
        return user.toResponseObject(token);
    }

    async getDetails(userId: string): Promise<UserDetailsRO> {
        const user1 = await this.userRepo.createQueryBuilder("user")
            .leftJoinAndSelect('user.sponsored', 'sponsored')
            .leftJoinAndSelect('user.ranks', 'ranks')
            .where('user.id = :userId', { userId })
            .getOne();

        if (!user1) {
            throw new HttpException('user not found', HttpStatus.NOT_FOUND);
        }

        const user2 = await this.userRepo.createQueryBuilder("user")
            .leftJoinAndSelect('user.incomes', 'incomes')
            .leftJoinAndSelect('user.withdrawals', 'withdrawals')
            .where('user.id = :userId', { userId })
            .getOne();

        const {
            balance: wallet,
            ranks,
            sponsored,
            totalSingleLeg: singleLeg
        } = user1;

        const { incomes, withdrawals } = user2;

        ranks?.sort((a, b) => {
            const aRank = Ranks.find(r => r.type === a.rank);
            const bRank = Ranks.find(r => r.type === b.rank);
            return (bRank.company - aRank.company);
        });
        const incomeAmounts = incomes.map(i => i.amount);
        const withdrawAmounts = withdrawals.filter(w => w.status === 'paid').map(w => w.withdrawAmount);
        const rank = ranks ? (ranks[0]?.rank ?? null) : null
        const direct = sponsored.length;
        const downline = (await User.getDownline(user1)).length;
        const levelIncome = incomeAmounts.length !== 0 ? incomeAmounts.reduce((a, b) => a + b) : 0;
        const singleLegIncome = ranks.length !== 0 ? ranks.map(r => r.income).reduce((a, b) => a + b) : 0;
        const totalWithdrawal = withdrawAmounts.length !== 0 ? withdrawAmounts.reduce((a, b) => a + b) : 0;
        const totalIncome = levelIncome + singleLegIncome;

        return {
            wallet, rank, direct, downline, singleLeg, levelIncome, singleLegIncome, totalWithdrawal, totalIncome
        };
    }

    async registerAdmin(data: AdminRegistrationDTO) {
        const { name, mobile, password } = data;
        const user = await this.userRepo.create({
            role: 'admin',
            sponsoredBy: null,
            status: 'active',
            name, mobile, password,
        });
        await this.userRepo.save(user);
        const token = await this.generateJWT(user.id);
        return user.toResponseObject(token);
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

    async forgotPassword(id: string, newPassword: string) {
        const user = await this.userRepo.findOne({ id });

        if (!user) {
            throw new HttpException('User Not Found', HttpStatus.NOT_FOUND);
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

    async updateSponsor(userId: string, sponsorId: string) {
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

    async deleteUser(id: string) {
        await this.userRepo.delete(id);
        return 'ok';
    }

    private generateJWT(userId: string) {
        return this.jwtService.signAsync({ userId });
    }
}
