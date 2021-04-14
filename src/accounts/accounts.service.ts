import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { User } from 'src/database/entity/user.entity';
import { getManager } from 'typeorm';
import {
  RegistrationDTO,
  LoginDTO,
  AdminRegistrationDTO,
  UpdatePasswordDTO,
  ProfileDTO,
  BankDTO,
} from './accounts.dto';
import { EPin } from 'src/database/entity/epin.entity';
import { IncomeService } from 'src/income/income.service';
import * as bcrypct from 'bcryptjs';
import { UserDetailsRO, UserFilter, UserRO } from 'src/interfaces';
import { JwtService } from '@nestjs/jwt';
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Transaction } from 'src/database/entity/transaction.entity';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { PagingQueryDTO } from '@common/dto/paging-query.dto';

@Injectable()
export class AccountsService {
  private readonly logger = new Logger(AccountsService.name);

  constructor(
    // @InjectQueue('account')
    // private readonly accountQueue: Queue,

    private readonly incomeService: IncomeService,

    private readonly jwtService: JwtService,
  ) {}

  findOne(id: string): Observable<UserRO> {
    return from(User.findOne(id, { relations: ['sponsoredBy', 'epin'] })).pipe(
      map(user => user?.toResponseObject()),
    );
  }

  getName(id: string): Observable<string> {
    return this.findOne(id).pipe(map(user => user?.name ?? 'not found'));
  }

  async getAll(
    filter: UserFilter,
    query?: PagingQueryDTO,
    search?: string,
  ): Promise<[UserRO[], number]> {
    const [users, total] = await User.findAll(filter, query, search);
    return [users.map(user => user.toResponseObject()), total];
  }

  async login(data: LoginDTO, admin = false) {
    const { userId, password } = data;
    const user = await User.findOne(userId, {
      relations: ['sponsoredBy', 'epin'],
    });

    if (
      !user ||
      !(await user.comparePassword(password)) ||
      (admin && user.role !== 'admin')
    ) {
      throw new HttpException(
        'Invalid userid/password',
        HttpStatus.BAD_REQUEST,
      );
    }
    const token = await this.generateJWT(userId);
    return user.toResponseObject(token);
  }

  async register(data: RegistrationDTO) {
    const { name, password, mobile, sponsorId } = data;
    const sponsoredBy = await User.findOne(sponsorId);
    if (!sponsoredBy) {
      throw new HttpException('Invalid sponspor id', HttpStatus.BAD_REQUEST);
    }
    if (sponsoredBy.status !== 'active') {
      throw new HttpException('Inactive sponsor', HttpStatus.BAD_REQUEST);
    }
    const user = User.create({
      role: 'user',
      name,
      password,
      mobile,
      sponsoredBy,
    });
    await user.save();
    const token = await this.generateJWT(user.id);
    return user.toResponseObject(token);
  }

  async getDetails(userId: string): Promise<UserDetailsRO> {
    const user = await User.getProfile(userId);

    if (!user) {
      throw new HttpException('user not found', HttpStatus.NOT_FOUND);
    }

    const { balance, sponsored, incomes, tasks, withdrawals } = user;

    const incomeAmounts = incomes.map(i => parseFloat(i.amount));
    const taskAmounts = tasks.map(t => parseFloat(t.amount));
    const withdrawAmounts = withdrawals
      .filter(w => w.status === 'paid')
      .map(w => w.withdrawAmount);
    const direct = sponsored.length;
    const downline = (await User.getDownline(user)).length;
    const levelIncome =
      incomeAmounts.length !== 0 ? incomeAmounts.reduce((a, b) => a + b) : 0;
    const selfIncome = 0;
    const taskIncome =
      taskAmounts.length !== 0 ? taskAmounts.reduce((a, b) => a + b) : 0;
    const totalWithdrawal =
      withdrawAmounts.length !== 0
        ? withdrawAmounts.reduce((a, b) => a + b)
        : 0;
    const totalIncome = levelIncome + taskIncome;

    return {
      wallet: parseFloat(balance),
      direct,
      downline,
      levelIncome,
      selfIncome,
      taskIncome,
      totalWithdrawal,
      totalIncome,
    };
  }

  async registerAdmin(data: AdminRegistrationDTO) {
    const { name, mobile, password } = data;
    const user = User.create({
      role: 'admin',
      sponsoredBy: null,
      status: 'active',
      name,
      mobile,
      password,
    });
    await user.save();
    const token = await this.generateJWT(user.id);
    return user.toResponseObject(token);
  }

  async activateAccount(epinId: string, userId: string) {
    const epin = await EPin.findOne(epinId, { relations: ['owner'] });

    if (!epin) {
      throw new HttpException('Invalid E-Pin', HttpStatus.NOT_FOUND);
    }
    if (epin.owner) {
      throw new HttpException('E-Pin already used', HttpStatus.BAD_REQUEST);
    }

    const user = await User.findOne(userId, {
      relations: ['sponsoredBy', 'epin'],
    });

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    if (user.status === 'active') {
      throw new HttpException('User already activated', HttpStatus.BAD_REQUEST);
    }

    user.epin = epin;
    user.status = 'active';
    user.activatedAt = new Date();
    await User.save(user);
    await this.incomeService.generateIncomes(user.id);

    // try {
    //   await this.accountQueue.add('distribution', { userId: user.id });
    // } catch (e) {
    //   this.logger.error(`Error queueing distribution for id ${user.id}`);
    // }

    return user.toResponseObject();
  }

  async activateByAdmin(userId: string) {
    const epin = await EPin.create().save();
    await this.activateAccount(epin.id, userId);
    return epin.id;
  }

  async updateProfile(data: ProfileDTO, userId: string) {
    const user = await User.update(userId, data);
    if (user.affected > 0) {
      return 'ok';
    } else {
      throw new HttpException(
        'Update Failed',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async updatePassword(data: UpdatePasswordDTO, userId: string) {
    const { oldPassword, newPassword } = data;
    const user = await User.findOne(userId);

    if (!user || !(await user.comparePassword(oldPassword))) {
      throw new HttpException('Invalid password', HttpStatus.BAD_REQUEST);
    }

    user.password = await bcrypct.hash(newPassword, 10);
    await user.save();

    return 'ok';
  }

  async forgotPassword(id: string, newPassword: string) {
    const user = await User.findOne(id);

    if (!user) {
      throw new HttpException('User Not Found', HttpStatus.NOT_FOUND);
    }

    user.password = await bcrypct.hash(newPassword, 10);
    await user.save();

    return 'ok';
  }

  async updateBankDetails(data: BankDTO, userId: string) {
    const user = await User.update(userId, { bankDetails: data });
    if (user.affected > 0) {
      return 'ok';
    } else {
      throw new HttpException(
        'Update Failed',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async updateSponsor(userId: string, sponsorId: string) {
    const sponsor = await User.findOne(sponsorId);
    if (!sponsor && !(sponsor.status === 'active')) {
      throw new HttpException('Invalid Sponsor', HttpStatus.BAD_REQUEST);
    }
    const user = await User.findOne(userId, {
      relations: ['generatedIncomes', 'sponsoredBy', 'epin'],
    });
    if (!user) {
      throw new HttpException('user not found', HttpStatus.NOT_FOUND);
    }

    await getManager().transaction(async trx => {
      user.sponsoredBy = sponsor;
      await trx.save(user);
      await this.incomeService.removePayments(user.generatedIncomes, trx);
      await this.incomeService.generateIncomes(user.id);
    });

    return user.toResponseObject();
  }

  async resetBalance() {
    const users = await User.find();
    await getManager().transaction(async trx => {
      for (const user of users) {
        user.balance = '0';
        await trx.save(user);
      }
    });
    return 'ok';
  }

  creditBalance(userId: string, amount: number) {
    try {
      return User.creditBalance(userId, amount);
    } catch (e) {
      throw new HttpException((e as Error).message, HttpStatus.BAD_REQUEST);
    }
  }

  async debitBalance(userId: string, amount: number) {
    const user = await User.findOne(userId);
    if (parseFloat(user.balance) < amount) {
      throw new HttpException('Insufficient balance', HttpStatus.BAD_REQUEST);
    }
    getManager().transaction(async trx => {
      user.balance = `${parseFloat(user.balance) - amount}`;
      await trx.save(user);
      const transaction = Transaction.create({
        amount: `${amount}`,
        currentBalance: user.balance,
        type: 'debit',
        remarks: 'Debited by Admin',
        owner: user,
      });
      await trx.save(transaction);
    });

    return 'ok';
  }

  async deleteUser(id: string) {
    await User.delete(id);
    return 'ok';
  }

  private generateJWT(userId: string) {
    return this.jwtService.signAsync({ userId });
  }
}
