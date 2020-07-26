import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/database/entity/user.entity';
import { Repository, Not, Between, getManager } from 'typeorm';
import { Withdrawal } from 'src/database/entity/withdrawal.entity';
import { WithdrawalDTO } from './withdrawal.dto';
import { Transaction } from 'src/database/entity/transaction.entity';

@Injectable()
export class WithdrawalService {
    constructor(
        @InjectRepository(User)
        private readonly userRepo: Repository<User>,

        @InjectRepository(Withdrawal)
        private readonly withdrawlRepo: Repository<Withdrawal>,

        @InjectRepository(Transaction)
        private readonly trxRepo: Repository<Transaction>,
    ) { }

    async get(userId: string) {
        const owner = await this.getUser(userId);
        const withdrawls = await this.withdrawlRepo.find({ where: { owner, status: Not('cancelled') } });
        return withdrawls.map(w => w.toResponseObject());
    }

    async getAll(status?: 'paid' | 'unpaid' | 'cancelled') {
        let withdrawals: Withdrawal[];
        if (status) {
            withdrawals = await this.withdrawlRepo.find({ where: { status }, relations: ['owner'] });
        } else {
            withdrawals = await this.withdrawlRepo.find({ relations: ['owner'] });
        }
        return withdrawals.map(w => ({
            ...w.toResponseObject(),
            fromId: w.owner.id,
            fromName: w.owner.name
        }));
    }

    async create(userId: string, data: WithdrawalDTO) {
        const owner = await this.getUser(userId);
        const { bankDetails } = owner;
        const { withdrawAmount } = data;
        const [morning, noon] = this.getTimes();

        if (owner.balance < withdrawAmount) {
            throw new HttpException('not enough balance', HttpStatus.BAD_REQUEST);
        }

        const lastRequest = await this.withdrawlRepo.find({
            where: { owner, status: Not('cancelled'), createdAt: Between(morning, noon) },
            relations: ['owner']
        });

        if (lastRequest.length > 0) {
            throw new HttpException('not more than one request per day', HttpStatus.BAD_REQUEST);
        }

        const indiaTime = new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" });
        const now = new Date(indiaTime);

        if (!(now.getTime() >= morning.getTime() && now.getTime() <= noon.getTime())) {
            throw new HttpException('incorrect time to request', HttpStatus.BAD_REQUEST);
        }

        return getManager().transaction(async trx => {
            const newWithdrawl = await this.withdrawlRepo.create({
                netAmount: owner.balance - withdrawAmount,
                withdrawAmount, owner, bankDetails
            });
            await trx.save(newWithdrawl);
            owner.balance = newWithdrawl.netAmount;
            await trx.save(owner);
            return newWithdrawl.toResponseObject();
        });
    }

    async update(id: string, status: 'paid' | 'unpaid' | 'cancelled') {
        const withdrawl = await this.withdrawlRepo.findOne(id, { relations: ['owner'] });
        const { owner } = withdrawl;

        if (withdrawl.status === 'cancelled') {
            throw new HttpException('request cancelled', HttpStatus.BAD_REQUEST);
        }

        return getManager().transaction(async trx => {
            withdrawl.status = status;
            await trx.save(withdrawl);
            if (status === 'cancelled') {
                owner.balance = owner.balance + withdrawl.withdrawAmount;
                await trx.save(owner);
            }
            if (status === 'paid') {
                const transaction = this.trxRepo.create({
                    amount: withdrawl.withdrawAmount,
                    currentBalance: withdrawl.netAmount,
                    type: 'debit',
                    remarks: 'Withdrawal Payment',
                    owner
                });
                await trx.save(transaction);
            }
            return 'ok';
        });
    }

    async payMultiple(ids: string) {
        const withdrawals = await this.withdrawlRepo.findByIds(ids.split(','), { relations: ['owner'] });

        return getManager().transaction(async trx => {
            for (let withdrawal of withdrawals) {
                const { owner } = withdrawal;

                if (withdrawal.status === 'cancelled') {
                    throw new HttpException(`${withdrawal.id} already canceled`, HttpStatus.BAD_REQUEST);
                }
                withdrawal.status = 'paid';
                await trx.save(withdrawal);

                const transaction = this.trxRepo.create({
                    amount: withdrawal.withdrawAmount,
                    currentBalance: withdrawal.netAmount,
                    type: 'debit',
                    remarks: 'Withdrawal Payment',
                    owner
                });
                await trx.save(transaction);
            }
            return 'ok';
        });
    }

    async unpayMultiple(ids: string) {
        const withdrawals = await this.withdrawlRepo.findByIds(ids.split(','));

        return getManager().transaction(async trx => {
            for (let withdrawal of withdrawals) {
                if (withdrawal.status === 'cancelled') {
                    throw new HttpException(`${withdrawal.id} already canceled`, HttpStatus.BAD_REQUEST);
                }
                withdrawal.status = 'unpaid';
                await trx.save(withdrawal);
            }
            return 'ok';
        });
    }

    async cancelMultiple(ids: string) {
        const withdrawals = await this.withdrawlRepo.findByIds(ids.split(','), { relations: ['owner'] });

        return getManager().transaction(async trx => {
            for (let withdrawal of withdrawals) {
                if (withdrawal.status === 'cancelled') {
                    throw new HttpException(`${withdrawal.id} already canceled`, HttpStatus.BAD_REQUEST);
                }
                const { owner } = withdrawal;
                owner.balance = owner.balance + withdrawal.withdrawAmount;
                await trx.save(owner);
                withdrawal.status = 'cancelled';
                await trx.save(withdrawal);
            }
            return 'ok';
        });
    }

    private async getUser(userId: string) {
        const user = await this.userRepo.findOne(userId);
        if (!user) {
            throw new HttpException('user not found', HttpStatus.NOT_FOUND);
        }
        return user;
    }

    private getTimes() {
        const indiaTime = new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" });
        const morning = new Date(indiaTime);
        morning.setHours(9);
        morning.setMinutes(0);
        morning.setSeconds(0);
        morning.setMilliseconds(0);
        const noon = new Date(morning);
        noon.setHours(14);

        return [morning, noon];
    }
}
