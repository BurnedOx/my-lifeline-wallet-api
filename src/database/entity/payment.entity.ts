import { PaymentRO } from 'src/interfaces';
import { Column, Entity, ManyToOne } from 'typeorm';
import { Base } from './base.entity';
import { User } from './user.entity';

export enum PaymentStatus {
  Failed = 'falied',
  Success = 'success',
  Pending = 'pending',
}

export enum OrderType {
  Activation = 'activation',
  EpinPurhase = 'epin_purchase',
}

@Entity()
export class Payment extends Base {
  @Column()
  txnToken: string;

  @Column()
  signature: string;

  @Column()
  amount: number;

  @Column({ default: PaymentStatus.Pending })
  status: PaymentStatus;

  @Column()
  orderType: OrderType;

  @Column({ nullable: true, default: null })
  extra: string | null;

  @ManyToOne(
    () => User,
    user => user.payments,
    { onDelete: 'CASCADE' },
  )
  owner: User;

  get responseObj(): PaymentRO {
      return {
          ...this,
          owner: this.owner && {
              id: this.owner.id,
              name: this.owner.name,
              mobile: this.owner.mobile,
          },
      };
  }
}
