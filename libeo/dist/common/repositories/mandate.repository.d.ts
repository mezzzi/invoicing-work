import { Repository } from 'typeorm';
import { Mandate } from '../entities/mandate.entity';
import { Company } from '../entities/company.entity';
export declare class MandateRepository extends Repository<Mandate> {
    findOneWithRelationships(mandateId: string, company: Company): Promise<Mandate>;
}
