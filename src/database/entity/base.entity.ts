import { CreateDateColumn, UpdateDateColumn, BaseEntity, PrimaryColumn, BeforeInsert } from "typeorm";
import { customAlphabet } from "nanoid";

export class Base extends BaseEntity {
    private generateId = customAlphabet('1234567890', 9)

    @PrimaryColumn()
    id: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @BeforeInsert()
    createId() {
        this.id = this.generateId();
    }
}