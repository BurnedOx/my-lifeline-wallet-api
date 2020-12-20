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

  @Column({ type: 'numeric', precision: 15, scale: 2 })
  currentBalance: string;

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
    const { id, level, amount, currentBalance, owner, from, createdAt } = this;
    return {
      id,
      level,
      amount,
      currentBalance,
      createdAt,
      ownerId: owner.id,
      from: { id: from.id, name: from.name },
    };
  }
}
