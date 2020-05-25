import { Entity, ManyToOne, JoinColumn, ManyToMany, Column } from "typeorm";
import { Base } from "./base.entity";
import { User } from "./user.entity";

@Entity()
export class Income extends Base {
    @Column()
    level: number;

    @Column()
    amount: number;

    @ManyToOne(() => User, user => user.incomes)
    owner: User;

    @ManyToMany(() => User, user => user.incomeGenerators)
    from: User;
}