import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/database/entity/user.entity';
import { Repository, Not, IsNull } from 'typeorm';
import { MemberRO } from 'src/interfaces';

@Injectable()
export class MembersService {
    constructor(
        @InjectRepository(User)
        private readonly userRepo: Repository<User>,
    ) { }

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
        return await this.getDownlineList(user);
    }

    async singleLegMembers(userId: string) {
        const user = await this.checkUser(userId);
        const allMembers = await this.userRepo.find({
            where: { activatedAt: Not(IsNull()) },
            order: { createdAt: 'DESC' },
        });
        const slMembers = allMembers
            .filter(m => m.activatedAt.getTime() > user.activatedAt.getTime())
            .map(m => m.toSingleLegMemberObject());
        return slMembers;
    }

    private async getDownlineList(root: User, downline: MemberRO[] = [], level: number = 1) {
        const members = await this.userRepo.find({
            where: { sponsoredBy: root },
            order: { createdAt: 'DESC' }
        });

        for (let member of members) {
            downline.push(member.toMemberObject(level));
            await this.getDownlineList(member, downline, level + 1);
        }
        return downline;
    }

    private async checkUser(userId: string) {
        const user = await this.userRepo.findOne(userId);
        if (!user) {
            throw new HttpException('Invalid userid', HttpStatus.NOT_FOUND);
        }
        if (user.status !== 'active') {
            throw new HttpException('Inactive User', HttpStatus.BAD_REQUEST);
        }
        return user;
    }
}
