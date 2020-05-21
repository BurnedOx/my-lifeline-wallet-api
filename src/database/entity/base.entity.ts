import { PrimaryColumn, CreateDateColumn, UpdateDateColumn, BaseEntity } from "typeorm";

export class Base extends BaseEntity {
    @PrimaryColumn()
    id: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}