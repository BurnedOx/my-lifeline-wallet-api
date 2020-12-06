import { PagingQueryDTO } from '@common/dto/paging-query.dto';
import { Exclude, Expose } from 'class-transformer';
import { UserEPinRO } from 'src/interfaces';
import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';
import { Base } from './base.entity';
import { EPin } from './epin.entity';
import { User } from './user.entity';

@Entity()
export class UserEpin extends Base {
  @ManyToOne(
    () => User,
    user => user.parchasedEpins,
    { onDelete: 'CASCADE' },
  )
  @JoinColumn()
  owner: User;

  @OneToOne(
    () => EPin,
    epin => epin.purchasedby,
    { onDelete: 'CASCADE' },
  )
  @JoinColumn()
  epin: EPin;

  @Column('text', { default: 'unused' })
  status: 'used' | 'unused';

  public static getByUserId(
    userId: string,
    status: 'used' | 'unused' = 'unused',
    query?: PagingQueryDTO,
  ) {
    let q = this.createQueryBuilder('userEpin')
      .leftJoinAndSelect('userEpin.epin', 'epin')
      .leftJoinAndSelect('userEpin.owner', 'owner')
      .where('owner.id = :userId', { userId })
      .andWhere('userEpin.status = :status', { status })
      .orderBy('userEpin.createdAt', 'DESC');

    if (query) {
      q = q.limit(query.limit).offset(query.offset);
    }

    return q.getManyAndCount();
  }

  get responseObject(): UserEPinRO {
    const { id, updatedAt, createdAt, epin, status } = this;
    return { id, ePinId: epin.id, status, createdAt, updatedAt };
  }
}
