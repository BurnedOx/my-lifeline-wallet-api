import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ROI } from 'src/database/entity/roi.entity';
import { Repository } from 'typeorm';
import { User } from 'src/database/entity/user.entity';

@Injectable()
export class RoiService {
    constructor(
        @InjectRepository(ROI)
        private readonly roiRepo: Repository<ROI>,

        @InjectRepository(User)
        private readonly userRepo: Repository<User>,
    ) { }

    async getMy(userId: string) {
        const user = await this.userRepo.findOne(userId);
        if (!user) {
            throw new HttpException('User Not Found', HttpStatus.NOT_FOUND);
        }
        const rois = await this.roiRepo.find({ where: { owner: user }, relations: ['owner', 'rank'] });
        return rois;
    }
}
