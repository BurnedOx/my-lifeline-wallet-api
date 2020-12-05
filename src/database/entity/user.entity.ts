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
  EntityManager,
  UpdateResult,
  MoreThan,
  Brackets,
  SelectQueryBuilder,
} from 'typeorm';
import { BankDetails, UserRO, MemberRO, UserFilter } from 'src/interfaces';
import * as bcrypct from 'bcryptjs';
import { EPin } from './epin.entity';
import { Income } from './income.entity';
import { Withdrawal } from './withdrawal.entity';
import { Transaction } from './transaction.entity';
import { from } from 'rxjs';
import { map } from 'rxjs/operators';
import { UserEpin } from './userEpin.entity';
import { EpinHistory } from './epinHistory.entity';
import { PagingQueryDTO } from '@common/dto/paging-query.dto';

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

  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypct.hash(this.password, 10);
  }

  /* Methods to render response objects
    And Queries */

  public static findById(id: string) {
    return from(this.findOne({ id })).pipe(map((user: User) => user));
  }

  public static findAll(
    filter: UserFilter,
    pagingQuery: PagingQueryDTO,
    search?: string,
  ) {
    let query = this.createQueryBuilder('user')
      .leftJoinAndSelect('user.sponsoredBy', 'sponsoredBy')
      .leftJoinAndSelect('user.epin', 'epin');

    if (search && search.trim() !== '') {
      query = this.searchQuery(query, search);
    }

    if (filter.status && filter.status !== 'all') {
      query = query.andWhere('user.status = :status', {
        status: filter.status,
      });
    }

    if (filter.wallet) {
      const { min, max } = filter.wallet;
      if (min < max)
        query = query
          .andWhere('user.balance >= :min', { min })
          .andWhere('user.balance <= :max', { max });
    }

    return query
      .orderBy('user.createdAt', 'DESC')
      .limit(pagingQuery.limit)
      .offset(pagingQuery.offset)
      .getManyAndCount();
  }

  public static findByActivationDate(startDate: Date, endDate: Date) {
    return this.createQueryBuilder('user')
      .andWhere('user.activatedAt BETWEEN :startDate AND :endDate', {
        startDate,
        endDate,
      })
      .getManyAndCount();
  }

  public static getProfile(userId: string) {
    return this.createQueryBuilder('user')
      .leftJoinAndSelect('user.sponsored', 'sponsored')
      .leftJoinAndSelect('user.incomes', 'incomes')
      .leftJoinAndSelect('user.withdrawals', 'withdrawals')
      .where('user.id = :userId', { userId })
      .getOne();
  }

  public static findDirectForRapid(
    sponsorId: string,
    startDate: Date,
    endDate: Date,
  ) {
    return this.createQueryBuilder('user')
      .leftJoinAndSelect('user.sponsoredBy', 'sponsoredBy')
      .where('sponsoredBy.id = :sponsorId', { sponsorId })
      .andWhere('user.activatedAt BETWEEN :startDate AND :endDate', {
        startDate,
        endDate,
      })
      .getManyAndCount();
  }

  public static getDirect(
    userId: string,
    query: PagingQueryDTO,
    status?: 'active' | 'inactive',
    search?: string,
  ) {
    let q = this.createQueryBuilder('user').leftJoinAndSelect(
      'user.sponsoredBy',
      'sponsoredBy',
    );

    if (search && search.trim() !== '') {
      q = this.searchQuery(q, search);
    }

    q = q.andWhere('sponsoredBy.id = :userId', { userId });

    if (status) {
      q = q.andWhere('user.status = :status', { status });
    }

    q = q.limit(query.limit).offset(query.offset);

    return q.getManyAndCount();
  }

  public static async getDownline(owner: User, status?: 'active' | 'inactive') {
    let query = this.createQueryBuilder('user')
      .leftJoinAndSelect('user.sponsoredBy', 'sponsoredBy')
      .where('user.createdAt > :date', { date: owner.createdAt });

    if (status) {
      query = query.andWhere('user.status = :status', { status });
    }

    const members = await query.getMany();

    const build = (
      root: User,
      downline: { member: User; level: number }[] = [],
      level: number = 1,
    ) => {
      const directs = members.filter(m => m.sponsoredBy.id === root.id);
      for (let member of directs) {
        downline.push({ member, level });
        build(member, downline, level + 1);
      }
      return downline;
    };

    return build(owner);
  }

  public static async creditBalance(
    id: string,
    amount: number,
    trx?: EntityManager,
  ) {
    const user = await (trx ? trx.findOne(this, id) : this.findOne(id));
    const options = { balance: user.balance + amount };
    const result = await (trx
      ? trx.update(this, { id }, options)
      : this.update(id, options));
    if (result.affected && result.affected === 0) {
      throw Error(
        'No changed made to the user. Entity might be missing. Check ' + id,
      );
    }
    return (trx ? trx.findOne(this, id) : this.findOne(id)).then(
      result => result ?? null,
    );
  }

  public static async debitBalance(id: string, amount: number) {
    const user = await this.findOne(id);
    const result = await this.update(id, { balance: user.balance - amount });
    if (result.affected && result.affected === 0) {
      throw Error(
        'No changed made to the user. Entity might be missing. Check ' + id,
      );
    }
    return this.findOne(id).then(result => result ?? null);
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

  private static searchQuery(query: SelectQueryBuilder<User>, search: string) {
    return query.where(
      new Brackets(qb => {
        qb.where('user.id = :search', {
          search: search.trim(),
        }).orWhere('LOWER(user.name) LIKE :name', {
          name: `%${search.toLocaleLowerCase().trim()}%`,
        });
      }),
    );
  }
}
