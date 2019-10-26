import { Repository } from 'typeorm';
import { List } from '../interfaces/common.interface';
import { AccountingPreferenceDto } from '../dto/accounting-preferences.dto';
import { AccountingPreference, AccountingPreferenceType } from '../entities/accounting-preference.entity';
import { Company } from '../entities/company.entity';
export declare class AccountingPreferencesService {
    private readonly accountingPreferenceRepository;
    constructor(accountingPreferenceRepository: Repository<AccountingPreference>);
    createOrUpdateAccountingPreferences(currentCompany: Company, data: AccountingPreferenceDto[]): Promise<List>;
    findByTypes(currentCompany: Company, types?: AccountingPreferenceType[], defaultOptions?: boolean): Promise<List>;
}
