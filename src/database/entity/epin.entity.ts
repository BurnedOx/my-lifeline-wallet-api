import { Entity, OneToOne, JoinColumn } from "typeorm";
import { Base } from "./base.entity";
import { User } from "./user.entity";
import { EpinRO } from "src/interfaces";

@Entity()
export class EPin extends Base {
    @OneToOne(type => User, user => user.epin, { nullable: true })
    owner: User | null;

    toResponseObject(): EpinRO {
        const { id, createdAt, updatedAt } = this;
        const owner = this.owner ? { id: this.owner.id, name: this.owner.name } : null;
        return { id, owner, createdAt, updatedAt };
    }
}