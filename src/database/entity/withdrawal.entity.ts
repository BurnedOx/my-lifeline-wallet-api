import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Base } from './base.entity';
import { User } from './user.entity';
import { WithdrawalRO, BankDetails } from 'src/interfaces';

@Entity()
export class Withdrawal extends Base {
  @Column()
  withdrawAmount: number;

  @Column()
  netAmount: number;

  @Column({ nullable: true, default: null })
  processedAt: Date | null;

  @Column({ default: 'By NEFT' })
  paymentType: string;

  @Column({ type: 'jsonb', nullable: true, default: null })
  bankDetails: BankDetails | null;

  @Column({ default: 'unpaid' })
  status: 'paid' | 'unpaid' | 'cancelled';

  @ManyToOne(
    () => User,
    user => user.withdrawals,
    { onDelete: 'CASCADE' },
  )
  @JoinColumn()
  owner: User;

  public static findByStatus(status: 'paid' | 'unpaid' | 'cancelled') {
    return this.createQueryBuilder('withdrawal')
      .where('withdrawal.status = :status', { status })
      .getManyAndCount();
  }

  public static findByStatusAndDate(
    status: 'paid' | 'unpaid' | 'cancelled',
    startDate: Date,
    endDate: Date,
  ) {
    return this.createQueryBuilder('withdrawal')
      .where('withdrawal.status = :status', { status })
      .where('withdrawal.processedAt BETWEEN :startDate AND :endDate', {
        startDate,
        endDate,
      })
      .getManyAndCount();
  }

  toResponseObject(): WithdrawalRO {
    const {
      id,
      withdrawAmount,
      netAmount,
      processedAt,
      paymentType,
      status,
      bankDetails,
      createdAt,
      updatedAt,
    } = this;

    return {
      id,
      withdrawAmount,
      netAmount,
      processedAt,
      paymentType,
      status,
      createdAt,
      updatedAt,
      ...bankDetails,
    };
  }
}
