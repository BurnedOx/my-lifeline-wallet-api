import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from 'src/database/entity/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Income } from 'src/database/entity/income.entity';
import { ROI } from 'src/database/entity/roi.entity';
import { Withdrawal } from 'src/database/entity/withdrawal.entity';
import { TransactionRO } from 'src/interfaces';

@Injectable()
export class TransactionService {

    constructor(
        @InjectRepository(User)
        private readonly userRepo: Repository<User>,

        @InjectRepository(Income)
        private readonly incomeRepo: Repository<Income>,

        @InjectRepository(ROI)
        private readonly roiRepo: Repository<ROI>,

        @InjectRepository(Withdrawal)
        private readonly withdrawalRepo: Repository<Withdrawal>,
    ) { }

    async getUserTransactions(userId: string): Promise<TransactionRO[]> {
        const owner = await this.userRepo.findOne(userId);
        if (!owner) {
            throw new HttpException('user not found', HttpStatus.NOT_FOUND);
        }
        const incomesTrx = (await this.incomeRepo.find({ where: { owner } }))
            .map(i => i.trxObject);
        const roisTrx = (await this.roiRepo.find({ where: { owner }, relations: ['rank'] }))
            .map(r => r.trxObject);
        const withdrawalsTrx = (await this.withdrawalRepo.find({ where: { owner } }))
            .map(w => w.trxObject);

        return [...incomesTrx, ...roisTrx, ...withdrawalsTrx].sort((a, b) => (
            b.createdAt.getTime() - a.createdAt.getTime()
        ));
    }
}
