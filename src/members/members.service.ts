import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/database/entity/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class MembersService {
    constructor(
        @InjectRepository(User)
        private readonly userRepo: Repository<User>
    ) { }

    async directMembers(userId: string) {
        const user = await this.checkUser(userId);
        const members = await this.userRepo.find({
            where: { sponsoredBy: user, status: 'active' },
            relations: ['sponsoredBy', 'epin'],
            order: { createdAt: 'DESC' }
        });
        return members.map(member => member.toResponseObject());
    }

    async downlineMembers(userId: string) {
        const user = await this.checkUser(userId);
        const members = await this.getDownlineList(user);
        return members.map(m => m.toResponseObject());
    }

    private async getDownlineList(root: User, downline: User[] = []) {
        const members = await this.userRepo.find({
            where: { sponsoredBy: root, status: 'active' },
            relations: ['sponsoredBy', 'epin'],
            order: { createdAt: 'DESC' }
        });

        for (let member of members) {
            downline.push(member);
            await this.getDownlineList(member, downline);
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
