import { BaseEntity } from 'typeorm';
import { Invoice } from './invoice.entity';
import { Contact } from './contact.entity';
import { User } from './user.entity';
import { Email } from './email.entity';
export declare class PaymentNotification extends BaseEntity {
    id: string;
    invoice: Invoice;
    contact: Contact;
    createdBy: User;
    email: Email;
    createdAt: Date;
    updatedAt: Date;
}
