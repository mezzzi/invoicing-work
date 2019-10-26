import { ICompany } from 'context/Company/types.d';
import { IUser } from 'context/User/types';

export enum IbanStatus {
  PASSED = 'passed',
  FAILED = 'failed',
  BLACKLIST = 'blacklist',
  FAKE = 'fake',
}

export interface IIban {
  id: string;
  iban: string;
  readerCompany: ICompany;
  treezorBeneficiaryId: number;
  createdBy: IUser;
  company: ICompany;
  result: string;
  returnCode: number;
  bic: string;
  country: string;
  bankCode: string;
  bank: string;
  bankAddress: string;
  branch: string;
  branchCode: string;
  inSclDirectory: string;
  sct: string;
  sdd: string;
  cor1: string;
  b2b: string;
  scc: string;
  jsonIbanBic: JSON;
  createdAt: Date;
  updatedAt: Date;
}

export interface IIbans {
  total: number;
  rows: IIban[];
}
