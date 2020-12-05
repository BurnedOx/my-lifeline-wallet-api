import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { PagingQueryDTO } from 'src/common/dto/paging-query.dto';
import { User } from 'src/database/entity/user.entity';
import { MemberRO } from 'src/interfaces';

@Injectable()
export class MembersService {
  async directMembers(
    userId: string,
    query: PagingQueryDTO,
    status?: 'active' | 'inactive',
    search?: string,
  ): Promise<[MemberRO[], number]> {
    const [members, total] = await User.getDirect(
      userId,
      query,
      status,
      search,
    );
    return [members.map(member => member.toMemberObject(1)), total];
  }

  async downlineMembers(
    userId: string,
    query: PagingQueryDTO,
    status?: 'active' | 'inactive',
    search?: string,
  ): Promise<[MemberRO[], number]> {
    const user = await this.checkUser(userId);

    let result = await User.getDownline(user, status);

    if (search && search.trim() !== '') {
      result = result.filter(
        ({ member }) =>
          member.id === search.trim() ||
          member.name.match(new RegExp(search.trim(), 'gi')),
      );
    }

    const downline = result
      .slice(query.offset, query.offset + query.limit)
      .map(({ member, level }) => member.toMemberObject(level));

    return [downline, result.length];
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
