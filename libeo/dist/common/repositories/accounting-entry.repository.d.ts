import { Repository } from 'typeorm';
import { AccountingEntry } from '../entities/accounting-entry.entity';
import { Company } from '../entities/company.entity';
export declare class AccountingEntryRepository extends Repository<AccountingEntry> {
    findByCompanyAndExportIdEmpty(company: Company): Promise<AccountingEntry[]>;
}
