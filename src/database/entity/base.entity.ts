import { CreateDateColumn, UpdateDateColumn, BaseEntity, PrimaryColumn } from "typeorm";

export class Base extends BaseEntity {
    @PrimaryColumn()
    id: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}