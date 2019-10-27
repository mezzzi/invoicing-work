import { Company } from '../entities/company.entity';
import { EntitySubscriberInterface, UpdateEvent } from 'typeorm';
export declare class CompanySubscriber implements EntitySubscriberInterface<Company> {
    listenTo(): typeof Company;
    afterUpdate(event: UpdateEvent<Company>): Promise<void>;
}
