import { Base } from "./base.entity";
import { Column, Entity, OneToMany, JoinColumn, ManyToOne, BeforeInsert, OneToOne, ManyToMany, JoinTable, EntityManager, UpdateResult } from "typeorm";
import { BankDetails, UserRO, MemberRO } from "src/interfaces";
import * as bcrypct from 'bcryptjs';
import { EPin } from "./epin.entity";
import { Income } from "./income.entity";
import { Withdrawal } from "./withdrawal.entity";
import { Transaction } from "./transaction.entity";
import { from } from "rxjs";
import { map } from "rxjs/operators";
import { Rapid } from "./rapid.entity";
import { UserEpin } from "./userEpin.entity";
import { EpinHistory } from "./epinHistory.entity";

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

    @OneToMany(type => User, user => user.sponsoredBy)
    sponsored: User[];

    @ManyToOne(type => User, user => user.sponsored, { nullable: true, onDelete: 'CASCADE' })
    @JoinColumn()
    sponsoredBy: User | null;

    @OneToOne(type => EPin, epin => epin.owner, { nullable: true })
    @JoinColumn()
    epin: EPin | null;

    @OneToMany(() => Income, income => income.owner)
    incomes: Income[];

    @OneToMany(() => Rapid, rapid => rapid.owner)
    challenges: Rapid[];

    @OneToMany(() => Income, income => income.from)
    generatedIncomes: Income[];

    @OneToMany(() => Withdrawal, withdrawal => withdrawal.owner)
    withdrawals: Withdrawal[];

    @OneToMany(() => Transaction, trx => trx.owner)
    trx: Transaction[];

    @OneToMany(() => UserEpin, userEpin => userEpin.owner)
    parchasedEpins: UserEpin[];

    @OneToMany(() => EpinHistory, epinHistory => epinHistory.owner)
    epinHistory: EpinHistory[];

    @BeforeInsert()
    async hashPassword() {
        this.password = await bcrypct.hash(this.password, 10);
    }

    /* Methods to render response objects
    And Queries */

    public static findById(id: string) {
        return from(this.findOne({ id })).pipe(
            map((user: User) => user)
        );
    }

    public static getProfile(userId: string) {
        return this.createQueryBuilder("user")
            .leftJoinAndSelect('user.sponsored', 'sponsored')
            .leftJoinAndSelect('user.incomes', 'incomes')
            .leftJoinAndSelect('user.withdrawals', 'withdrawals')
            .where('user.id = :userId', { userId })
            .getOne();
    }

    public static findDirectForRapid(sponsorId: string, startDate: Date, endDate: Date) {
        return this.createQueryBuilder('user')
            .leftJoinAndSelect('user.sponsoredBy', 'sponsoredBy')
            .where("sponsoredBy.id = :sponsorId", { sponsorId })
            .andWhere("user.activatedAt BETWEEN :startDate AND :endDate", { startDate, endDate })
            .getManyAndCount();
    }

    public static async getDownline(
        root: User,
        downline: { member: User; level: number }[] = [],
        level: number = 1
    ) {
        const members = await this.find({
            where: { sponsoredBy: root },
            order: { createdAt: 'DESC' }
        });

        for (let member of members) {
            downline.push({ member, level });
            await this.getDownline(member, downline, level + 1);
        }
        return downline;
    }

    public static async creditBalance(id: string, amount: number, trx?: EntityManager) {
        const user = await (trx ? trx.findOne(this, id) : this.findOne(id));
        const options = { balance: user.balance + amount };
        const result = await (trx ? trx.update(this, { id }, options) : this.update(id, options));
        if (result.affected && result.affected === 0) {
            throw Error("No changed made to the user. Entity might be missing. Check " + id);
        }
        return (trx ? trx.findOne(this, id) : this.findOne(id))
            .then(result => result ?? null);
    }

    public static async debitBalance(id: string, amount: number) {
        const user = await this.findOne(id);
        const result = await this.update(id, { balance: user.balance - amount });
        if (result.affected && result.affected === 0) {
            throw Error("No changed made to the user. Entity might be missing. Check " + id);
        }
        return this.findOne(id).then(result => result ?? null);
    }

    toResponseObject(token?: string): UserRO {
        const { id, name, mobile, balance: wallet, panNumber, bankDetails, role: roll, status, sponsoredBy, activatedAt, updatedAt, createdAt } = this;
        const data: UserRO = {
            id, name, mobile, wallet, panNumber, roll, status, bankDetails, activatedAt, updatedAt, createdAt,
            sponsoredBy: sponsoredBy ? { id: sponsoredBy.id, name: sponsoredBy.name } : null,
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