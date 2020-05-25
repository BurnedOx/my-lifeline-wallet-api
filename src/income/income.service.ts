import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Income } from 'src/database/entity/income.entity';
import { Repository } from 'typeorm';
import { User } from 'src/database/entity/user.entity';

@Injectable()
export class IncomeService {
    constructor(
        @InjectRepository(Income)
        private readonly incomeRepo: Repository<Income>,

        @InjectRepository(User)
        private readonly userRepo: Repository<User>
    ) {}

    async getIncomes(userId: string) {
        const user = await this.userRepo.findOne(userId);
        if (!user) {
            throw new HttpException('user not found', HttpStatus.NOT_FOUND);
        }
        const incomes = await this.incomeRepo.find({where: {owner: user}, relations: ['owner', 'from']});
        return incomes.map(i => i.toResponseObject());
    }
}
