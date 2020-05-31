import { Entity, Column, ManyToOne, JoinColumn } from "typeorm";
import { Base } from "./base.entity";
import { User } from "./user.entity";
import { Rank } from "./rank.entity";
import { RoiRO } from "src/interfaces";

@Entity()
export class ROI extends Base {
    @Column()
    credit: number;

    @Column()
    currentBalance: number;

    @ManyToOne(() => User, user => user.singleLegIncomes)
    @JoinColumn()
    owner: User;

    @ManyToOne(() => Rank, rank => rank.incomes)
    @JoinColumn()
    rank: Rank;

    toResponseObject(): RoiRO {
        const { id, credit, currentBalance, rank, updatedAt, createdAt } = this;
        return {
            id, credit, currentBalance, updatedAt, createdAt,
            rank: rank.rank
        };
    }
}