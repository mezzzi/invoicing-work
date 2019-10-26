import { BaseEntity } from 'typeorm';
import { Contact } from './contact.entity';
import { Company } from './company.entity';
export declare class User extends BaseEntity {
    id: string;
    email: string;
    firstname: string;
    lastname: string;
    readonly fullName: string;
    password: string;
    enabled: boolean;
    blocked: boolean;
    confirmationToken: string;
    confirmationPasswordToken: string;
    token: string;
    lastCguAccept: Date;
    lastLogin: Date;
    currentCompany: Company;
    contacts: Contact[];
    createdAt: Date;
    updatedAt: Date;
    lowerCaseEmail(): void;
}
