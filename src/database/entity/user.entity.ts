import { Base } from "./base.entity";
import { Column, Entity, OneToMany, JoinColumn, ManyToOne, BeforeInsert, OneToOne } from "typeorm";
import { BankDetails, UserRO, MemberRO, SingleLegMemberRO } from "src/interfaces";
import * as bcrypct from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { EPin } from "./epin.entity";
import { Income } from "./income.entity";
import { ROI } from "./roi.entity";
import { Rank } from "./rank.entity";

@Entity()
export class User extends Base {
    @Column('text')
    name: string;

    @Column('numeric')
    mobile: number;

    @Column('text')
    password: string;

    @Column({ default: 'user' })
    roll: 'user' | 'admin';

    @Column({ default: 'inactive' })
    status: 'active' | 'inactive';

    @Column({ nullable: true, default: null })
    activatedAt: Date | null;

    @Column({ type: 'jsonb', nullable: true, default: null })
    bankDetails: BankDetails | null;

    @Column({ nullable: true, default: null })
    panNumber: number | null;

    @Column({ default: 0 })
    balance: number;

    @OneToMany(type => User, user => user.sponsoredBy)
    sponsored: User[];

    @ManyToOne(type => User, user => user.sponsored, { nullable: true })
    @JoinColumn()
    sponsoredBy: User | null;

    @OneToOne(type => EPin, epin => epin.owner, { nullable: true })
    @JoinColumn()
    epin: EPin | null;

    @OneToMany(() => Income, income => income.owner)
    incomes: Income[];

    @OneToMany(() => Income, income => income.from)
    generatedIncomes: Income[];

    @OneToMany(() => ROI, roi => roi.owner)
    singleLegIncomes: ROI[];

    @OneToMany(() => Rank, rank => rank.owner)
    @JoinColumn()
    ranks: Rank[];

    @ManyToOne(() => Rank, rank => rank.direct, { nullable: true })
    @JoinColumn()
    generatedRank: Rank | null;

    @BeforeInsert()
    async hashPassword() {
        this.password = await bcrypct.hash(this.password, 10);
    }

    toResponseObject(getToken: boolean = false): UserRO {
        const { id, name, mobile, bankDetails, panNumber, roll, status, sponsoredBy, balance, activatedAt, updatedAt, createdAt } = this;
        const data: UserRO = {
            id, name, mobile, bankDetails, panNumber, roll, status, balance, activatedAt, updatedAt, createdAt,
            sponsoredBy: sponsoredBy ? { id: sponsoredBy.id, name: sponsoredBy.name } : null,
            epinId: this.epin?.id ?? null,
        };
        if (getToken) {
            data.token = this.token;
        }
        return data;
    }

    toMemberObject(level: number): MemberRO {
        const { id, name, status, activatedAt, createdAt } = this;
        return { id, name, level, status, createdAt, activatedAt };
    }

    toSingleLegMemberObject(): SingleLegMemberRO {
        const { id, name, activatedAt } = this;
        return { id, name, activatedAt };
    }

    async comparePassword(attempt: string) {
        return await bcrypct.compare(attempt, this.password);
    }

    private get token() {
        const { id } = this;
        return jwt.sign({ id }, process.env.SECRET, { expiresIn: '7d' });
    }
}