import { EntitySubscriberInterface, InsertEvent, UpdateEvent } from 'typeorm';
import { Company } from '../entities/company.entity';
export declare class CompanySubscriber implements EntitySubscriberInterface<Company> {
    private delay;
    private createWallet;
    private createMoralUser;
    private createPhysicalUsers;
    listenTo(): typeof Company;
    afterInsert(event: InsertEvent<Company>): Promise<void>;
    afterUpdate(event: UpdateEvent<Company>): Promise<void>;
}
