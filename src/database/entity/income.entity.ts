import { Entity, ManyToOne, JoinColumn, Column } from "typeorm";
import { Base } from "./base.entity";
import { User } from "./user.entity";
import { IncomeRO } from "src/interfaces";

@Entity()
export class Income extends Base {
    @Column()
    level: number;

    @Column()
    amount: number;

    @ManyToOne(() => User, user => user.incomes)
    @JoinColumn()
    owner: User;

    @ManyToOne(() => User, user => user.generatedIncomes)
    @JoinColumn()
    from: User;

    toResponseObject(): IncomeRO {
        const { id, level, amount, owner, from, createdAt } = this;
        return {
            id, level, amount, createdAt,
            ownerId: owner.id,
            from: { id: from.id, name: from.name }
        };
    }
}