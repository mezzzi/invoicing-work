import { AccountingPreferenceType } from '../entities/accounting-preference.entity';
export declare class AccountingPreferenceDto {
    id?: string;
    key: string;
    value: string;
    description?: string;
    type: AccountingPreferenceType;
    order?: number;
    enabled?: boolean;
    company?: any;
}
