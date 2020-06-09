import { Base } from "./base.entity";
import { Column, Entity, OneToMany, JoinColumn, ManyToOne, BeforeInsert, OneToOne, ManyToMany, JoinTable } from "typeorm";
import { BankDetails, UserRO, MemberRO, SingleLegMemberRO } from "src/interfaces";
import * as bcrypct from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { EPin } from "./epin.entity";
import { Income } from "./income.entity";
import { ROI } from "./roi.entity";
import { Rank } from "./rank.entity";
import { Ranks } from "src/common/costraints";

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

    @Column({ default: 0 })
    totalSingleLeg: number;

    @Column({ type: 'jsonb', nullable: true, default: null })
    bankDetails: BankDetails | null;

    @Column({ nullable: true, default: null })
    panNumber: string | null;

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
        const { id, name, mobile, panNumber, roll, status, sponsoredBy, balance, ranks, activatedAt, updatedAt, createdAt } = this;
        ranks.sort((a, b) => {
            const aRank = Ranks.find(r => r.type === a.rank);
            const bRank = Ranks.find(r => r.type === b.rank);
            return (bRank.company - aRank.company);
        });
        const data: UserRO = {
            id, name, mobile, panNumber, roll, status, balance, activatedAt, updatedAt, createdAt,
            sponsoredBy: sponsoredBy ? { id: sponsoredBy.id, name: sponsoredBy.name } : null,
            epinId: this.epin?.id ?? null,
            rank: ranks ? (ranks[0]?.rank ?? null) : null
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