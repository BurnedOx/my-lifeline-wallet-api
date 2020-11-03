import moment = require('moment');
import {
  Column,
  Entity,
  EntityManager,
  In,
  JoinColumn,
  ManyToOne,
  UpdateResult,
} from 'typeorm';
import { Base } from './base.entity';
import { User } from './user.entity';

@Entity()
export class Rapid extends Base {
  @Column()
  startDate: Date;

  @Column()
  endDate: Date;

  @Column({ default: 1000 })
  amount: number;

  @Column({ default: 10 })
  target: number;

  @Column({ default: 'incomplete' })
  status: 'incomplete' | 'complete';

  @ManyToOne(
    () => User,
    user => user.challenges,
    { onDelete: 'CASCADE' },
  )
  @JoinColumn()
  owner: User;

  public static findByOwner(ownerId: string) {
    return this.createQueryBuilder('rapid')
      .leftJoinAndSelect('rapid.owner', 'owner')
      .where('owner.id = :ownerId', { ownerId })
      .orderBy('rapid.createdAt', 'DESC')
      .getOne()
      .then(b => b ?? null);
  }

  public static findIncompleteToday() {
    const [today, tomorrow] = this.getDates();
    return this.createQueryBuilder('rapid')
      .leftJoinAndSelect('rapid.owner', 'owner')
      .where("rapid.status = 'incomplete'")
      .andWhere('rapid.endDate BETWEEN :today AND :tomorrow', {
        today,
        tomorrow,
      })
      .getMany();
  }

  public static async updateToNext(
    ids: string[],
    endDate: Date,
    trx: EntityManager,
  ) {
    let result = await trx.update(
      this,
      { id: In(ids) },
      { amount: 2500, target: 30, endDate },
    );

    if (result.affected && result.affected === 0) {
      throw Error(
        'No changed made to the challenge. Entity might be missing. Check ' +
          ids,
      );
    }
    return trx.findByIds(this, ids, { relations: ['owner'] });
  }

  public static async completeChallenges(ids: string[], trx: EntityManager) {
    let result = await trx.update(
      Rapid,
      { id: In(ids) },
      { status: 'complete' },
    );

    if (result.affected && result.affected === 0) {
      throw Error(
        'No changed made to the challenge. Entity might be missing. Check ' +
          ids,
      );
    }

    return trx.findByIds(this, ids, { relations: ['owner'] });
  }

  private static getDates() {
    const indiaTime = new Date().toLocaleString('en-US', {
      timeZone: 'Asia/Kolkata',
    });
    const now = new Date(indiaTime);
    const today = new Date(
      moment(now)
        .set('hours', 0)
        .set('minutes', 0)
        .set('minutes', 0)
        .format(),
    );
    const tomorrow = new Date(
      moment(today)
        .add(1, 'days')
        .format(),
    );
    return [today, tomorrow];
  }
}
