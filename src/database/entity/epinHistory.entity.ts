import { PagingQueryDTO } from '@common/dto/paging-query.dto';
import { EPinHistoryRO } from 'src/interfaces';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Base } from './base.entity';
import { EPin } from './epin.entity';
import { User } from './user.entity';

@Entity()
export class EpinHistory extends Base {
  @ManyToOne(
    () => User,
    user => user.epinHistory,
    { onDelete: 'CASCADE' },
  )
  @JoinColumn()
  owner: User;

  @ManyToOne(
    () => EPin,
    epin => epin.history,
    { onDelete: 'CASCADE' },
  )
  @JoinColumn()
  epin: EPin;

  @Column('text')
  remark: string;

  public static getByUserId(userId: string, query: PagingQueryDTO) {
    return this.createQueryBuilder('history')
      .leftJoinAndSelect('history.epin', 'epin')
      .leftJoin('history.owner', 'owner')
      .where('owner.id = :ownerId', { ownerId: userId })
      .orderBy('history.createdAt', 'DESC')
      .limit(query.limit)
      .offset(query.offset)
      .getManyAndCount();
  }

  public static getAdminHistory(query: PagingQueryDTO) {
    return this.createQueryBuilder('history')
      .leftJoinAndSelect('history.epin', 'epin')
      .leftJoin('history.owner', 'owner')
      .where("owner.role = 'admin'")
      .orderBy('history.createdAt', 'DESC')
      .limit(query.limit)
      .offset(query.offset)
      .getManyAndCount();
  }

  public static findPurchasedByDate(startDate: Date, endDate: Date) {
    return this.createQueryBuilder('history')
      .where('history.createdAt BETWEEN :startDate AND :endDate', {
        startDate,
        endDate,
      })
      .andWhere("history.remark IN ('Purchased', 'Received from Admin')")
      .getManyAndCount();
  }

  get responseObject(): EPinHistoryRO {
    const { id, createdAt, updatedAt, remark, epin } = this;
    return { id, ePinId: epin.id, remark, createdAt, updatedAt };
  }
}
