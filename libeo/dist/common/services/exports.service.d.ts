import { Repository } from 'typeorm';
import { Export } from '../entities/export.entity';
import { Company } from '../entities/company.entity';
import { AccountingEntryRepository } from '../repositories/accounting-entry.repository';
import { List } from '../interfaces/common.interface';
export declare class ExportsService {
    private readonly exportRepository;
    private readonly accountingEntryRepository;
    constructor(exportRepository: Repository<Export>, accountingEntryRepository: AccountingEntryRepository);
    generate(company: Company): Promise<string>;
    findByCompany(company: Company, orderBy?: string, limit?: number, offset?: number): Promise<List>;
}
