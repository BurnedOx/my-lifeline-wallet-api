import { Entity, ManyToOne, JoinColumn, Column } from 'typeorm';
import { Base } from './base.entity';
import { User } from './user.entity';
import { IncomeRO, TransactionRO } from 'src/interfaces';

@Entity()
export class Income extends Base {
  @Column()
  level: number;

  @Column({ type: 'numeric', precision: 15, scale: 2 })
  amount: string;

  @Column({ type: 'numeric', precision: 15, scale: 2, default: '0' })
  remaining: string;

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

  toResponseObject(): IncomeRO {
    const { id, level, amount, remaining, owner, from, createdAt } = this;
    return {
      id,
      level,
      amount,
      remaining,
      createdAt,
      ownerId: owner.id,
      from: { id: from.id, name: from.name },
    };
  }
}
