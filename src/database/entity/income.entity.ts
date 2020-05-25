import { Entity, ManyToOne, JoinColumn, Column } from "typeorm";
import { Base } from "./base.entity";
import { User } from "./user.entity";

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
}