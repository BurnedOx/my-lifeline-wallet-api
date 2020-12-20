import { TransactionRO } from 'src/interfaces';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Base } from './base.entity';
import { User } from './user.entity';

@Entity()
export class Transaction extends Base {
  @Column({ type: 'numeric', precision: 15, scale: 2 })
  amount: string;

  @Column({ type: 'numeric', precision: 15, scale: 2 })
  currentBalance: string;

  @Column()
  type: 'credit' | 'debit';

  @Column()
  remarks: string;

  @ManyToOne(
    () => User,
    user => user.trx,
    { onDelete: 'CASCADE' },
  )
  @JoinColumn()
  owner: User;

  get responseObj(): TransactionRO {
    const { id, amount, currentBalance, type, remarks, createdAt } = this;

    return {
      credit: type === 'credit' ? amount : undefined,
      debit: type === 'debit' ? amount : undefined,
      currentBalance,
      remarks,
      createdAt,
      id,
    };
  }
}
