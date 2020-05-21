import { Entity, OneToOne, ManyToOne, OneToMany, JoinColumn } from "typeorm";
import { Base } from "./base.entity";
import { User } from "./user.entity";

Entity()
export class Sponsor extends Base {
    @ManyToOne(type => User, user => user.sponsored, { onDelete: 'CASCADE' })
    @JoinColumn()
    sponsoredBy: User;

    @OneToMany(type => User, user => user.sponsoredBy)
    @JoinColumn()
    sponsored: User[];
}