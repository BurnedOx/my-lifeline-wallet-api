import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ROI } from 'src/database/entity/roi.entity';
import { Repository, Not, IsNull, getManager, EntityManager } from 'typeorm';
import { User } from 'src/database/entity/user.entity';
import { Cron } from '@nestjs/schedule';
import { Rank } from 'src/database/entity/rank.entity';
import { Ranks } from 'src/common/costraints';
import { generateId } from 'src/common/utils/generateId';

@Injectable()
export class RoiService {
    private shouldGenerateROI: boolean = true;

    constructor(
        @InjectRepository(ROI)
        private readonly roiRepo: Repository<ROI>,

        @InjectRepository(User)
        private readonly userRepo: Repository<User>,
    ) { }

    get roiGenerationState() {
        return this.shouldGenerateROI;
    }

    set roiGenerationState(state: boolean) {
        this.shouldGenerateROI = state;
    }

    async getMy(userId: string) {
        const user = await this.userRepo.findOne(userId);
        if (!user) {
            throw new HttpException('User Not Found', HttpStatus.NOT_FOUND);
        }
        const rois = await this.roiRepo.find({
            where: { owner: user },
            relations: ['owner', 'rank'],
            order: { createdAt: 'DESC' }
        });
        return rois.map(roi => roi.toResponseObject());
    }

    @Cron('0 59 23 * * *')
    async generateDailyROI() {
        if (!this.shouldGenerateROI) {
            Logger.log(`ROI generation postponded for ${new Date().toDateString()}`, 'ROI service');
            return;
        }

        const users = await this.userRepo.find({
            where: { activatedAt: Not(IsNull()) },
            relations: ['ranks']
        });

        await getManager().transaction(async trx => {
            for (let user of users) {
                for (let rank of user.ranks) {
                    await this.generateROI(user, rank, trx);
                }
            }
        });

        Logger.log(`ROI generated for ${new Date().toDateString()}`, 'ROI service');
    }

    async deleteAll() {
        const roi = await this.roiRepo.find();
        await this.roiRepo.remove(roi);
        return 'ok';
    }

    private async generateROI(owner: User, rank: Rank, trx: EntityManager) {
        const doneROIs = await this.roiRepo.find({ where: { owner, rank }, relations: ['owner', 'rank'] });
        const rankObj = Ranks.find(r => r.type === rank.rank);
        if (doneROIs.length < rankObj.validity) {
            owner.balance = owner.balance + rankObj.income;
            await trx.save(owner);

            const newROI = this.roiRepo.create({
                id: generateId(),
                credit: rankObj.income,
                currentBalance: owner.balance,
                owner, rank
            });
            await trx.save(newROI);
        }
    }
}
