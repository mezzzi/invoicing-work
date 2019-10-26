import { BaseEntity } from 'typeorm';
import { User } from './user.entity';
import { Company } from './company.entity';
import { Email } from './email.entity';
export declare class Contact extends BaseEntity {
    id: string;
    firstname: string;
    lastname: string;
    readonly fullName: string;
    user: User;
    company: Company;
    emails: Email[];
    visibleOnlyCompany: string;
    createdAt: Date;
    updatedAt: Date;
}
