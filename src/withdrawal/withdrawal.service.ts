import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/database/entity/user.entity';
import { Repository, Not, Between, getManager } from 'typeorm';
import { Withdrawal } from 'src/database/entity/withdrawal.entity';
import { WithdrawalDTO } from './withdrawal.dto';

@Injectable()
export class WithdrawalService {
    constructor(
        @InjectRepository(User)
        private readonly userRepo: Repository<User>,

        @InjectRepository(Withdrawal)
        private readonly withdrawlRepo: Repository<Withdrawal>,
    ) { }

    async get(userId: string) {
        const owner = await this.getUser(userId);
        const withdrawls = await this.withdrawlRepo.find({ where: { owner, status: Not('cancelled') } });
        return withdrawls.map(w => w.toResponseObject());
    }

    async getAll(status?: 'paid' | 'unpaid' | 'cancelled') {
        const withdrawls = await this.withdrawlRepo.find({ where: { status }, relations: ['owner'] });
        return withdrawls.map(w => ({
            ...w.toResponseObject(),
            fromId: w.owner.id,
            fromName: w.owner.name
        }));
    }

    async create(userId: string, data: WithdrawalDTO) {
        const owner = await this.getUser(userId);
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

        if (!(Date.now() >= morning.getTime() && Date.now() <= noon.getTime())) {
            throw new HttpException('incorrect time to request', HttpStatus.BAD_REQUEST);
        }

        return getManager().transaction(async trx => {
            const newWithdrawl = await this.withdrawlRepo.create({
                netAmount: owner.balance - withdrawAmount,
                withdrawAmount, owner
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
            trx.save(withdrawl);
            if (status === 'cancelled') {
                owner.balance = owner.balance + withdrawl.withdrawAmount;
                trx.save(owner);
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
        const morning = new Date();
        morning.setHours(6);
        morning.setMinutes(0);
        morning.setSeconds(0);
        morning.setMilliseconds(0);
        const noon = new Date(morning);
        noon.setHours(12);

        return [morning, noon];
    }
}
