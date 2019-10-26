import { IAddress, IInputAddress } from 'context/Addresses/types';
import { IContact } from 'context/Contacts/types.d';

export enum ICompanyProvisionningStrategies {
  topup = 'TOPUP',
  autoload = 'AUTOLOAD',
}

export enum ICompanyStatus {
  unknown = 'UNKNOW',
  exist = 'EXIST',
  already = 'ALREADY',
  self = 'SELF',
}

export enum IKycStatus {
  CONTRACT_SIGNED = 'CONTRACT_SIGNED',
  BENEFICIARIES_ADDED = 'BENEFICIARIES_ADDED',
  BENEFICIARIES_VALIDATED = 'BENEFICIARIES_VALIDATED',
  PENDING = 'PENDING',
  SUMMARY = 'SUMMARY',
  VALIDATED = 'VALIDATED',
  REFUSED = 'REFUSED',
}

export const KycStatus: any = Object.keys(IKycStatus).reduce(
  (o, v, i) => ({ ...o, [v]: i }),
  {},
);

export enum IPartnerOrder {
  createdAt_ASC = 'createdAt_ASC',
  createdAt_DESC = 'createdAt_DESC',
  updatedAt_ASC = 'updatedAt_ASC',
  updatedAt_DESC = 'updatedAt_DESC',
}

export interface ICompany {
  id: number;
  siren: string;
  siret: string;
  name: string;
  brandName: string;
  templatePreference: number;
  logoUrl: string;
  naf: string;
  nafNorm: string;
  numberEmployees: string;
  legalForm: string;
  category: string;
  incorporateAt: number;
  vatNumber: string;
  source: string;
  slogan: string;
  domainName: string;
  capital: number;
  invoicesSent: number;
  invoicesReceived: number;
  phone: string;
  treezorEmail: string;
  treezorUserId: number;
  treezorWalletId: number;
  treezorIban: string;
  treezorBic: string;
  incorporationAt: Date;
  createdAt: Date;
  updatedAt: Date;
  provisionningStrategy: ICompanyProvisionningStrategies;
  status: ICompanyStatus;
  kycStep: string;
  kycStatus: IKycStatus;
  addresses?: {
    total: number;
    rows: IAddress[];
  };
  contacts?: {
    total: number;
    rows: IContact[];
  };
}

export interface ICompanies {
  total: number;
  rows: ICompany[];
}

export interface IInputCompany {
  siren?: string;
  siret?: string;
  name?: string;
  brandName?: string;
  templatePreference?: number;
  logoUrl?: string;
  naf?: string;
  nafNorm?: string;
  numberEmployees?: string;
  legalForm?: string;
  slogan?: string;
  domainName?: string;
  category?: string;
  vatNumber?: string;
  incorporationAt?: Date;
  capital?: number;
  legalAnnualTurnOver?: string;
  legalNetIncomeRange?: string;
  provisionningStrategy?: ICompanyProvisionningStrategies;
  phone?: string;
  addresses?: IInputAddress[];
}
