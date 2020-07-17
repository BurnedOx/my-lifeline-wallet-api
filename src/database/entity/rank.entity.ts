import { Entity, Column, ManyToOne, JoinColumn, OneToMany } from "typeorm";
import { Base } from "./base.entity";
import { RankName, TransactionRO } from "src/interfaces";
import { User } from "./user.entity";

@Entity()
export class Rank extends Base {
    @Column('text')
    rank: RankName;

    @Column()
    income: number;

    @ManyToOne(() => User, user => user.ranks, { onDelete: 'CASCADE', nullable: false })
    @JoinColumn()
    owner: User;

    @OneToMany(() => User, user => user.generatedRank, { onDelete: 'CASCADE' })
    direct: User[];
}