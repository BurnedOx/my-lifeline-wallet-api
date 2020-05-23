import { Base } from "./base.entity";
import { Column, Entity, OneToMany, JoinColumn, ManyToOne, BeforeInsert } from "typeorm";
import { BankDetails, UserRO } from "interfaces";
import * as bcrypct from 'bcryptjs';
import * as jwt from 'jsonwebtoken';

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

    @OneToMany(type => User, user => user.sponsoredBy)
    @JoinColumn()
    sponsored: User[];

    @ManyToOne(type => User, user => user.sponsored, { nullable: true })
    @JoinColumn()
    sponsoredBy: User | null;

    @BeforeInsert()
    async hashPassword() {
        this.password = await bcrypct.hash(this.password, 10);
    }

    toResponseObject(getToken: boolean = false): UserRO {
        const { id, name, mobile, bankDetails, panNumber, roll, status, updatedAt, createdAt } = this;
        const data: UserRO = { id, name, mobile, bankDetails, panNumber, roll, status, updatedAt, createdAt };
        if (getToken) {
            data.token = this.token;
        }
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