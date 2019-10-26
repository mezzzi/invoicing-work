import { BaseEntity } from 'typeorm';
import { User } from './user.entity';
import { HistoryEvent } from '../dto/histories.dto';
export declare enum HistoryEntity {
    ADDRESS = "ADDRESS",
    COMPANY = "COMPANY",
    CONTACT = "CONTACT",
    EMAIL = "EMAIL",
    INVOICE = "INVOICE",
    PARTNER = "PARTNER",
    USER = "USER",
    PAYMENT = "PAYMENT"
}
export declare class History extends BaseEntity {
    id: string;
    entity: HistoryEntity;
    entityId: string;
    event: HistoryEvent;
    params: any;
    user: User;
    createdAt: Date;
    updatedAt: Date;
}
