import { Entity, ManyToOne, JoinColumn, Column } from 'typeorm';
import { Base } from './base.entity';
import { User } from './user.entity';
import { IncomeRO } from 'src/interfaces';

@Entity()
export class Income extends Base {
  @Column()
  level: number;

  @Column({ type: 'numeric', precision: 15, scale: 2 })
  amount: string;

  @ManyToOne(
    () => User,
    user => user.incomes,
    { onDelete: 'CASCADE' },
  )
  @JoinColumn()
  owner: User;

  @ManyToOne(
    () => User,
    user => user.generatedIncomes,
    { onDelete: 'CASCADE' },
  )
  @JoinColumn()
  from: User;

  public static getToBePaid() {
    return this.createQueryBuilder('income')
      .leftJoinAndSelect('income.owner', 'owner')
      .where('income.remaining > 0')
      .getMany();
  }

  toResponseObject(): IncomeRO {
    const { id, level, amount, owner, from, createdAt } = this;
    return {
      id,
      level,
      amount,
      createdAt,
      ownerId: owner.id,
      from: { id: from.id, name: from.name },
    };
  }
}
