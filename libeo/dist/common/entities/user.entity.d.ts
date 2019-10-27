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
    emailConfirmationToken: string;
    passwordConfirmationToken: string;
    token: string;
    lastCguAccept: Date;
    lastLogin: Date;
    currentCompany: Company;
    contacts: Contact[];
    createdAt: Date;
    updatedAt: Date;
    lowerCaseEmail(): void;
}
