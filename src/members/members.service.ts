import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/database/entity/user.entity';
import { Repository, Not, IsNull, getManager } from 'typeorm';
import { MemberRO } from 'src/interfaces';
import { async } from 'rxjs/internal/scheduler/async';

@Injectable()
export class MembersService {
    constructor(
        @InjectRepository(User)
        private readonly userRepo: Repository<User>,
    ) { }

    async updateSingleLeg() {
        const users = await this.userRepo.find({ where: { activatedAt: Not(IsNull()) } });
        await getManager().transaction(async trx => {
            for (let user of users) {
                const singleLegMembers = await this.getSingleLeg(user);
                user.totalSingleLeg = singleLegMembers.length;
                trx.save(user);
            }
        });

        return 'ok';
    }

    async directMembers(userId: string) {
        const user = await this.checkUser(userId);
        const members = await this.userRepo.find({
            where: { sponsoredBy: user },
            order: { createdAt: 'DESC' }
        });
        return members.map(member => member.toMemberObject(1));
    }

    async downlineMembers(userId: string) {
        const user = await this.checkUser(userId);
        return (await User.getDownline(user))
            .map(({ member, level }) => member.toMemberObject(level));
    }

    async singleLegMembers(userId: string) {
        const user = await this.checkUser(userId);
        const members = await this.getSingleLeg(user);
        return members.map(m => m.toSingleLegMemberObject());
    }

    private async checkUser(userId: string) {
        const user = await this.userRepo.findOne(userId, { relations: ['sponsored', 'sponsoredBy'] });
        if (!user) {
            throw new HttpException('Invalid userid', HttpStatus.NOT_FOUND);
        }
        return user;
    }

    private async getSingleLeg(user: User) {
        if (user.activatedAt === null) {
            throw new HttpException('Inactive User', HttpStatus.BAD_REQUEST);
        }

        const allMembers = await this.userRepo.find({
            where: { activatedAt: Not(IsNull()) },
            order: { createdAt: 'DESC' },
        });

        return allMembers.filter(m => m.activatedAt.getTime() > user.activatedAt.getTime());
    }
}
