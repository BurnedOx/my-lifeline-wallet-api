import { EPinHistoryRO } from "src/interfaces";
import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { Base } from "./base.entity";
import { EPin } from "./epin.entity";
import { User } from "./user.entity";

@Entity()
export class EpinHistory extends Base {
    @ManyToOne(() => User, user => user.epinHistory, { onDelete: 'CASCADE' })
    @JoinColumn()
    owner: User;

    @ManyToOne(() => EPin, epin => epin.history, { onDelete: 'CASCADE' })
    @JoinColumn()
    epin: EPin;

    @Column('text')
    remark: string;

    public static getByUserId(userId: string) {
        return this.createQueryBuilder('history')
            .leftJoinAndSelect('history.epin', 'epin')
            .leftJoin('history.owner', 'owner')
            .where('owner.id = :ownerId', { ownerId: userId })
            .getMany();
    }

    public static getAdminHistory() {
        return this.createQueryBuilder('history')
            .leftJoinAndSelect('history.epin', 'epin')
            .leftJoin('history.owner', 'owner')
            .where("owner.role = 'admin'")
            .getMany();
    }

    get responseObject(): EPinHistoryRO {
        const { id, createdAt, updatedAt, remark, epin } = this;
        return { id, ePinId: epin.id, remark, createdAt, updatedAt };
    }
}