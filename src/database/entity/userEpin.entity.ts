import { Exclude, Expose } from "class-transformer";
import { UserEPinRO } from "src/interfaces";
import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from "typeorm";
import { Base } from "./base.entity";
import { EPin } from "./epin.entity";
import { User } from "./user.entity";

@Entity()
export class UserEpin extends Base {
    @ManyToOne(() => User, user => user.parchasedEpins, { onDelete: 'CASCADE' })
    @JoinColumn()
    owner: User;

    @OneToOne(() => EPin, epin => epin.purchasedby)
    @JoinColumn()
    epin: EPin;

    @Column('text', { default: 'unused' })
    status: 'used' | 'unused';

    public static getByUserId(userId: string, status: 'used' | 'unused' = 'unused') {
        return this.createQueryBuilder('userEpin')
            .leftJoinAndSelect('userEpin.epin', 'epin')
            .leftJoinAndSelect('userEpin.owner', 'owner')
            .where('owner.id = :userId', { userId })
            .andWhere('userEpin.status = :status', { status })
            .getManyAndCount()
    }

    get responseObject(): UserEPinRO {
        const { id, updatedAt, createdAt, epin, status } = this;
        return { id, ePinId: epin.id, status, createdAt, updatedAt };
    }
}