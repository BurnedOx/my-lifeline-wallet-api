import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PagingQueryDTO } from 'src/common/dto/paging-query.dto';
import { User } from 'src/database/entity/user.entity';
import { MemberRO } from 'src/interfaces';
import { Repository, Not, IsNull, getManager } from 'typeorm';

@Injectable()
export class MembersService {
  async directMembers(userId: string, query: PagingQueryDTO): Promise<[MemberRO[], number]> {
    const user = await this.checkUser(userId);
    const members = await User.find({
      where: { sponsoredBy: user },
      order: { createdAt: 'DESC' },
      take: query.limit,
      skip: query.offset,
    });
    return [members.map(member => member.toMemberObject(1)), members.length];
  }

  async downlineMembers(
    userId: string,
    query: PagingQueryDTO,
    status?: 'active' | 'inactive',
  ): Promise<[MemberRO[], number]> {
    const user = await this.checkUser(userId);
    let downline = (await User.getDownline(user)).map(({ member, level }) =>
      member.toMemberObject(level),
    );
    if (status) {
      downline = downline.filter(m => m.status === status);
    }
    return [
      downline.slice(query.offset, query.offset + query.limit),
      downline.length,
    ];
  }

  private async checkUser(userId: string) {
    const user = await User.findOne(userId, {
      relations: ['sponsored', 'sponsoredBy'],
    });
    if (!user) {
      throw new HttpException('Invalid userid', HttpStatus.NOT_FOUND);
    }
    return user;
  }
}
