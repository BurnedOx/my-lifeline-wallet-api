import { Base } from "./base.entity";
import { Column, Entity, OneToMany, JoinColumn, OneToOne } from "typeorm";
import { BankDetails } from "interfaces";
import { Sponsor } from "./sponsor.entity";

@Entity()
export class User extends Base {
    @Column()
    userName: string;

    @Column()
    password: string;

    @Column()
    roll: 'user' | 'admin';

    @Column({default: 'inactive'})
    status: 'active' | 'inactive';

    @Column()
    contactNumber: number;

    @Column({type: 'jsonb', nullable: true, default: null})
    bankDetails: BankDetails | null;

    @Column({nullable: true, default: null})
    panNumber: number | null;

    @OneToMany(type => Sponsor, sponsor => sponsor.sponsoredBy)
    @JoinColumn()
    sponsored: Sponsor[];

    @OneToOne(type => Sponsor, sponsor => sponsor.sponsored)
    @JoinColumn()
    sponsoredBy: Sponsor;
}