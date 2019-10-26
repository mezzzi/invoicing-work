import { Base } from './base.entity';
import { Company } from './company.entity';
export declare enum AccountingPreferenceType {
    LEDGER_BANK = "LEDGER_BANK",
    LEDGER_PURCHASE = "LEDGER_PURCHASE",
    LEDGER_SALES = "LEDGER_SALES",
    LEDGER_MISC = "LEDGER_MISC",
    VAT_ACCOUNT = "VAT_ACCOUNT",
    VENDOR_ACCOUNT = "VENDOR_ACCOUNT",
    PURCHASE_ACCOUNT = "PURCHASE_ACCOUNT",
    BANK_ACCOUNT = "BANK_ACCOUNT",
    BANK_ACCOUNT_TREEZOR = "BANK_ACCOUNT_TREEZOR"
}
export declare class AccountingPreference extends Base {
    company: Company;
    key: string;
    value: string;
    description: string;
    type: AccountingPreferenceType;
    enabled: boolean;
    order: number;
}
