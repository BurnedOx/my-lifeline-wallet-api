import { Entity, OneToOne, ManyToOne, JoinColumn, Column } from "typeorm";
import { Base } from "./base.entity";
import { User } from "./user.entity";

Entity()
export class Sponsor extends Base {
    @Column()
    @ManyToOne(type => User, user => user.sponsored, { onDelete: 'CASCADE' })
    sponsoredBy: User;

    @Column()
    @OneToOne(type => User, user => user.sponsoredBy)
    sponsored: User;
}