import { Entity, OneToOne, JoinColumn, OneToMany } from 'typeorm';
import { Base } from './base.entity';
import { User } from './user.entity';
import { EpinRO } from 'src/interfaces';
import { UserEpin } from './userEpin.entity';
import { EpinHistory } from './epinHistory.entity';

@Entity()
export class EPin extends Base {
  @OneToOne(
    type => User,
    user => user.epin,
    { nullable: true, onDelete: 'SET NULL' },
  )
  owner: User | null;

  @OneToOne(
    () => UserEpin,
    userEpin => userEpin.epin,
    { nullable: true, onDelete: 'SET NULL' },
  )
  purchasedby: UserEpin | null;

  @OneToMany(
    () => EpinHistory,
    epinHistory => epinHistory.epin,
  )
  history: EpinHistory[];

  public static getAll() {
    return this.createQueryBuilder('epin')
      .leftJoinAndSelect('epin.owner', 'owner')
      .leftJoinAndSelect('epin.purchasedby', 'purchasedby')
      .orderBy('epin.createdAt', 'DESC')
      .getMany();
  }

  public static getUsed() {
    return this.createQueryBuilder('epin')
      .leftJoinAndSelect('epin.owner', 'owner')
      .leftJoinAndSelect('epin.purchasedby', 'purchasedby')
      .where('owner.epin IS NOT NULL')
      .andWhere('purchasedby IS NOT NULL')
      .orderBy('epin.createdAt', 'DESC')
      .getMany();
  }

  public static getUnused() {
    return this.createQueryBuilder('epin')
      .leftJoinAndSelect('epin.owner', 'owner')
      .leftJoinAndSelect('epin.purchasedby', 'purchasedby')
      .where('owner IS NULL')
      .andWhere('purchasedby IS NULL')
      .orderBy('epin.createdAt', 'DESC')
      .getMany();
  }

  toResponseObject(): EpinRO {
    const { id, createdAt, updatedAt } = this;
    const owner = this.owner
      ? { id: this.owner.id, name: this.owner.name }
      : null;
    const status = owner === null ? 'unused' : 'used';
    return { id, owner, status, createdAt, updatedAt };
  }
}
