import { List } from '../interfaces/common.interface';
import { AccountingPreferenceDto } from '../dto/accounting-preferences.dto';
import { AccountingPreferenceType } from '../entities/accounting-preference.entity';
import { AccountingPreferencesService } from '../services/accounting-preferences.service';
export declare class AccountingPreferencesResolvers {
    private readonly accountingPreferencesService;
    constructor(accountingPreferencesService: AccountingPreferencesService);
    createOrUpdateAccountingPreferences(ctx: any, input: AccountingPreferenceDto[]): Promise<List>;
    accountingPreferences(ctx: any, types?: AccountingPreferenceType[], defaultOptions?: boolean): Promise<List>;
}
