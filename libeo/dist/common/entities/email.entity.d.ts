import { BaseEntity } from 'typeorm';
import { Contact } from './contact.entity';
export declare class Email extends BaseEntity {
    id: string;
    email: string;
    visibleOnlyCompany: string;
    contact: Contact;
    createdAt: Date;
    updatedAt: Date;
}
