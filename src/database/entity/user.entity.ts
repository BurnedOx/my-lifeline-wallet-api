import { Base } from './base.entity';
import {
  Column,
  Entity,
  OneToMany,
  JoinColumn,
  ManyToOne,
  BeforeInsert,
  OneToOne,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { BankDetails, UserRO, MemberRO } from 'src/interfaces';
import * as bcrypct from 'bcryptjs';
import { EPin } from './epin.entity';
import { Income } from './income.entity';
import { Withdrawal } from './withdrawal.entity';
import { Transaction } from './transaction.entity';
import { from } from 'rxjs';
import { map } from 'rxjs/operators';
import { UserEpin } from './userEpin.entity';
import { EpinHistory } from './epinHistory.entity';
import { Payment } from './payment.entity';

@Entity()
export class User extends Base {
  @Column('text')
  name: string;

  @Column('numeric')
  mobile: number;

  @Column('text')
  password: string;

  @Column({ default: 'user' })
  role: 'user' | 'admin';

  @Column({ default: 'inactive' })
  status: 'active' | 'inactive';

  @Column({ nullable: true, default: null })
  activatedAt: Date | null;

  @Column({ type: 'jsonb', nullable: true, default: null })
  bankDetails: BankDetails | null;

  @Column({ nullable: true, default: null })
  panNumber: string | null;

  @Column({ default: 0 })
  balance: number;

  @OneToMany(
    type => User,
    user => user.sponsoredBy,
  )
  sponsored: User[];

  @ManyToOne(
    type => User,
    user => user.sponsored,
    { nullable: true, onDelete: 'CASCADE' },
  )
  @JoinColumn()
  sponsoredBy: User | null;

  @OneToOne(
    type => EPin,
    epin => epin.owner,
    { nullable: true },
  )
  @JoinColumn()
  epin: EPin | null;

  @OneToMany(
    () => Income,
    income => income.owner,
  )
  incomes: Income[];

  @OneToMany(
    () => Income,
    income => income.from,
  )
  generatedIncomes: Income[];

  @OneToMany(
    () => Withdrawal,
    withdrawal => withdrawal.owner,
  )
  withdrawals: Withdrawal[];

  @OneToMany(
    () => Transaction,
    trx => trx.owner,
  )
  trx: Transaction[];

  @OneToMany(
    () => UserEpin,
    userEpin => userEpin.owner,
  )
  parchasedEpins: UserEpin[];

  @OneToMany(
    () => EpinHistory,
    epinHistory => epinHistory.owner,
  )
  epinHistory: EpinHistory[];

  @OneToMany(
    () => Payment,
    payment => payment.owner,
  )
  payments: Payment[];

  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypct.hash(this.password, 10);
  }

  /* Methods to render response objects
    And Queries */

  public static findById(id: string) {
    return from(this.findOne({ id })).pipe(map((user: User) => user));
  }

  public static async getDownline(
    root: User,
    downline: { member: User; level: number }[] = [],
    level: number = 1,
  ) {
    const members = await this.find({
      where: { sponsoredBy: root },
      order: { createdAt: 'DESC' },
    });

    for (let member of members) {
      downline.push({ member, level });
      await this.getDownline(member, downline, level + 1);
    }
    return downline;
  }

  toResponseObject(token?: string): UserRO {
    const {
      id,
      name,
      mobile,
      balance: wallet,
      panNumber,
      bankDetails,
      role: roll,
      status,
      sponsoredBy,
      activatedAt,
      updatedAt,
      createdAt,
    } = this;
    const data: UserRO = {
      id,
      name,
      mobile,
      wallet,
      panNumber,
      roll,
      status,
      bankDetails,
      activatedAt,
      updatedAt,
      createdAt,
      sponsoredBy: sponsoredBy
        ? { id: sponsoredBy.id, name: sponsoredBy.name }
        : null,
      epinId: this.epin?.id ?? null,
    };
    if (token) {
      data.token = token;
    }
    return data;
  }

  toMemberObject(level: number): MemberRO {
    const { id, name, status, activatedAt, createdAt } = this;
    return { id, name, level, status, createdAt, activatedAt };
  }

  async comparePassword(attempt: string) {
    return await bcrypct.compare(attempt, this.password);
  }
}
