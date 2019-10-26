import { BaseEntity } from 'typeorm';
import { Company } from './company.entity';
export declare class Address extends BaseEntity {
    id: string;
    siret: string;
    address1: string;
    address2: string;
    zipcode: number;
    city: string;
    country: string;
    company: Company;
    createdAt: Date;
    updatedAt: Date;
}
