import { ICompany } from 'context/Company/types.d';

export enum AccountingPreferenceType {
  LEDGER_BANK = 'LEDGER_BANK',
  LEDGER_PURCHASE = 'LEDGER_PURCHASE',
  LEDGER_SALES = 'LEDGER_SALES',
  LEDGER_MISC = 'LEDGER_MISC',
  VAT_ACCOUNT = 'VAT_ACCOUNT',
  PURCHASE_ACCOUNT = 'PURCHASE_ACCOUNT',
  BANK_ACCOUNT = 'BANK_ACCOUNT',
  BANK_ACCOUNT_TREEZOR = 'BANK_ACCOUNT_TREEZOR',
}

export const ArrayAccountingPreferenceType: any = Object.keys(
  AccountingPreferenceType,
).reduce((o, v, i) => ({ ...o, [v]: i }), {});

export interface IAccountingPreference {
  id?: string;
  key?: string;
  value?: React.ReactNode;
  description?: React.ReactNode;
  type?: AccountingPreferenceType;
  order?: number;
  enabled?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  company?: ICompany;
}

export interface IAccountingPreferences {
  total: number;
  rows: IAccountingPreference[];
}

export interface IAccountingPreferenceInput {
  id?: string;
  key?: string;
  value?: string;
  description?: string;
  type?: AccountingPreferenceType;
  order?: number;
  enabled?: boolean;
}

export interface IAccountingExport {
  id: string;
  company: ICompany;
  fileLink: string;
  enabled: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IAccountingExports {
  total: number;
  rows: IAccountingExport[];
}
