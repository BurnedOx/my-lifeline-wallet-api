import { Entity, Column, ManyToOne, JoinColumn, OneToMany } from "typeorm";
import { Base } from "./base.entity";
import { RankName } from "src/interfaces";
import { User } from "./user.entity";
import { ROI } from "./roi.entity";

@Entity()
export class Rank extends Base {
    @Column('text')
    rank: RankName;

    @ManyToOne(() => User, user => user.ranks)
    @JoinColumn()
    owner: User;

    @OneToMany(() => User, user => user.generatedRank)
    @JoinColumn()
    direct: User[];

    @OneToMany(() => ROI, roi => roi.rank)
    incomes: ROI[];
}