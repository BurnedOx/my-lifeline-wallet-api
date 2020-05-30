import { Entity, Column, ManyToOne, JoinColumn } from "typeorm";
import { Base } from "./base.entity";
import { User } from "./user.entity";
import { Rank } from "./rank.entity";

@Entity()
export class ROI extends Base {
    @Column()
    creadit: number;

    @Column()
    currentBalance: number;

    @ManyToOne(() => User, user => user.singleLegIncomes)
    @JoinColumn()
    owner: User;

    @ManyToOne(() => Rank, rank => rank.incomes)
    @JoinColumn()
    rank: Rank;
}