import { Entity, OneToOne, OneToMany, JoinColumn } from "typeorm";
import { Base } from "./base.entity";
import { User } from "./user.entity";
import { EpinRO } from "src/interfaces";
import { UserEpin } from "./userEpin.entity";
import { EpinHistory } from "./epinHistory.entity";
import { Expose } from "class-transformer";
import { PagingQueryDTO } from "@common/dto/paging-query.dto";

@Entity()
export class EPin extends Base {
    @OneToOne(type => User, user => user.epin, { nullable: true, onDelete: 'SET NULL' })
    owner: User | null;

    @OneToOne(() => UserEpin, userEpin => userEpin.epin, { nullable: true, onDelete: 'SET NULL' })
    purchasedby: UserEpin | null;

    @OneToMany(() => EpinHistory, epinHistory => epinHistory.epin)
    history: EpinHistory[];

    public static getAll(query: PagingQueryDTO) {
        return this.createQueryBuilder("epin")
            .leftJoinAndSelect("epin.owner", "owner")
            .leftJoinAndSelect("epin.purchasedby", "purchasedby")
            .orderBy("epin.createdAt", "DESC")
            .limit(query.limit)
            .offset(query.offset)
            .getMany();
    }

    public static getUsed(query: PagingQueryDTO) {
        return this.createQueryBuilder("epin")
            .leftJoinAndSelect("epin.owner", "owner")
            .leftJoinAndSelect("epin.purchasedby", "purchasedby")
            .where("owner IS NOT NULL")
            .orWhere("purchasedby IS NOT NULL")
            .orderBy("epin.createdAt", "DESC")
            .limit(query.limit)
            .offset(query.offset)
            .getMany();
    }

    public static getUnused(query: PagingQueryDTO) {
        return this.createQueryBuilder("epin")
            .leftJoinAndSelect("epin.owner", "owner")
            .leftJoinAndSelect("epin.purchasedby", "purchasedby")
            .where("owner IS NULL")
            .andWhere("purchasedby IS NULL")
            .orderBy("epin.createdAt", "DESC")
            .limit(query.limit)
            .offset(query.offset)
            .getMany();
    }

    toResponseObject(): EpinRO {
        const { id, createdAt, updatedAt } = this;
        const owner = this.owner ? { id: this.owner.id, name: this.owner.name } : null;
        const status = owner === null ? 'unused' : 'used';
        return { id, owner, status, createdAt, updatedAt };
    }
}