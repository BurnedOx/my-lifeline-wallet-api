import { Entity, Column, ManyToOne, JoinColumn } from "typeorm";
import { Base } from "./base.entity";
import { User } from "./user.entity";
import { WithdrawlRO } from "src/interfaces";

@Entity()
export class Withdrawl extends Base {
    @Column()
    withdrawAmount: number;

    @Column()
    netAmount: number;

    @Column({ nullable: true, default: null })
    processedAt: Date | null;

    @Column({ default: 'By NEFT' })
    paymentType: string;

    @Column({ default: 'unpaid' })
    status: 'paid' | 'unpaid' | 'cancelled';

    @ManyToOne(() => User, user => user.withdrawls, { onDelete: 'CASCADE' })
    @JoinColumn()
    owner: User;

    toResponseObject(): WithdrawlRO {
        const {
            id,
            withdrawAmount,
            netAmount,
            processedAt,
            paymentType,
            status,
            owner,
            createdAt,
            updatedAt
        } = this;

        const { bankDetails } = owner;

        return { id, withdrawAmount, netAmount, processedAt, paymentType, status, createdAt, updatedAt, ...bankDetails };
    }
}