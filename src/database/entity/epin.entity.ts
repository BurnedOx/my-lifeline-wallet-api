import { Entity, OneToOne, JoinColumn } from "typeorm";
import { Base } from "./base.entity";
import { User } from "./user.entity";
import { EpinRO } from "src/interfaces";

@Entity()
export class EPin extends Base {
    @OneToOne(type => User, user => user.epin, { nullable: true, onDelete: 'SET NULL' })
    owner: User | null;

    public static getAll() {
        return this.createQueryBuilder("epin")
            .leftJoinAndSelect("epin.owner", "owner")
            .orderBy("epin.createdAt", "DESC")
            .getMany();
    }

    public static getUsed() {
        return this.createQueryBuilder("epin")
            .leftJoinAndSelect("epin.owner", "owner")
            .where("owner.epin IS NOT NULL")
            .orderBy("epin.createdAt", "DESC")
            .getMany();
    }

    public static getUnused() {
        return this.createQueryBuilder("epin")
            .leftJoinAndSelect("epin.owner", "owner")
            .where("owner IS NULL")
            .orderBy("epin.createdAt", "DESC")
            .getMany();
    }

    toResponseObject(): EpinRO {
        const { id, createdAt, updatedAt } = this;
        const owner = this.owner ? { id: this.owner.id, name: this.owner.name } : null;
        const status = owner === null ? 'unused' : 'used';
        return { id, owner, status, createdAt, updatedAt };
    }
}