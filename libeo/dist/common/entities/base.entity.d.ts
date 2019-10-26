import { BaseEntity } from 'typeorm';
export declare abstract class Base extends BaseEntity {
    id: string;
    createdAt: Date;
    updatedAt: Date;
}
