import { Base } from "./base.entity";
import { Column, Entity, OneToMany, JoinColumn, ManyToOne, BeforeInsert, OneToOne } from "typeorm";
import { BankDetails, UserRO, MemberRO } from "interfaces";
import * as bcrypct from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { EPin } from "./epin.entity";
import { Income } from "./income.entity";

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
    incomeGenerators: Income[];

    @BeforeInsert()
    async hashPassword() {
        this.password = await bcrypct.hash(this.password, 10);
    }

    toResponseObject(getToken: boolean = false): UserRO {
        const { id, name, mobile, bankDetails, panNumber, roll, status, sponsoredBy, updatedAt, createdAt } = this;
        const data: UserRO = {
            id, name, mobile, bankDetails, panNumber, roll, status, updatedAt, createdAt,
            sponsoredBy: sponsoredBy ? { id: sponsoredBy.id, name: sponsoredBy.name } : null,
            epinId: this.epin?.id ?? null,
            activatedAt: this.epin?.updatedAt ?? null
        };
        if (getToken) {
            data.token = this.token;
        }
        return data;
    }

    toMemberObject(level: number): MemberRO {
        const { id, name, status, epin, createdAt } = this;
        const data: MemberRO = {
            id, name, level, status, createdAt,
            activatedAt: epin?.updatedAt ?? null
        };
        return data;
    }

    async comparePassword(attempt: string) {
        return await bcrypct.compare(attempt, this.password);
    }

    private get token() {
        const { id } = this;
        return jwt.sign({ id }, process.env.SECRET, { expiresIn: '7d' });
    }
}