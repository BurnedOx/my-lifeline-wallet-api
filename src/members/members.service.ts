import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/database/entity/user.entity';
import { Repository, Not, IsNull, getManager } from 'typeorm';

@Injectable()
export class MembersService {
    async directMembers(userId: string) {
        const user = await this.checkUser(userId);
        const members = await User.find({
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

    private async checkUser(userId: string) {
        const user = await User.findOne(userId, { relations: ['sponsored', 'sponsoredBy'] });
        if (!user) {
            throw new HttpException('Invalid userid', HttpStatus.NOT_FOUND);
        }
        return user;
    }
}
