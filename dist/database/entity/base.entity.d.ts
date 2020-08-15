import { BaseEntity } from "typeorm";
export declare class Base extends BaseEntity {
    private generateId;
    id: string;
    createdAt: Date;
    updatedAt: Date;
    createId(): void;
}
