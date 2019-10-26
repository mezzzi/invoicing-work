import { ICompany } from 'context/Company/types.d';
import { IIban } from 'context/Iban/types';
import { IUser } from 'context/User/types';

export enum MandateStatus {
  Pending = 'PENDING',
  Validated = 'VALIDATED',
  Canceled = 'CANCELED',
  Signed = 'SIGNED',
}

export interface IMandate {
  id: string;
  bankAccount: IBankAccount;
  treezorMandateId: string;
  filePath: string;
  rum: string;
  status: MandateStatus;
  signatory: IUser;
  signatoryIp: string;
  validationCode: string;
  signaturedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}
export interface IBankAccount {
  id: string;
  company: ICompany;
  iban: IIban;
  label: string;
  default: boolean;
  enabled: boolean;
  mandates: IMandate[];
}

export interface IBankAccounts {
  total: number;
  rows: IBankAccount[];
}

export interface IInputBankAccount {
  iban?: string;
  label: string;
}
