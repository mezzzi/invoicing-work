import { Base } from './base.entity';
import { Company } from './company.entity';
import { Export } from './export.entity';
import { AccountingPreference } from './accounting-preference.entity';
export declare enum AccountingEntryType {
    INVOICE = "INVOICE",
    PAYMENT = "PAYMENT"
}
export declare enum AccountingEntryPostingType {
    CREDIT = "CREDIT",
    DEBIT = "DEBIT"
}
export declare class AccountingEntry extends Base {
    company: Company;
    ledger: AccountingPreference;
    account: AccountingPreference;
    postingType: AccountingEntryPostingType;
    entryDate: Date;
    entryRef: string;
    entryLabel: string;
    entryAmount: number;
    entryCurrency: string;
    entryType: AccountingEntryType;
    export: Export;
}
