import { BaseEntity } from 'typeorm';
import { Company } from './company.entity';
export declare class Partner extends BaseEntity {
    id: string;
    name: string;
    companyInitiator: Company;
    companyPartner: Company;
    createdAt: Date;
    updatedAt: Date;
}
