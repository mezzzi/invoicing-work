import { IAccountingPreference } from 'context/Accounting/types';
import { IIban } from 'context/Iban/types';
import { IHistories } from '../Common/types';
import { ICompany, IInputCompany } from '../Company/types.d';
import { IUser } from '../User/types';

export enum InvoiceStatus {
  Importing = 'IMPORTING',
  Imported = 'IMPORTED',
  Scanning = 'SCANNING',
  Scanned = 'SCANNED',
  BusinessValidation = 'BUSINESS_VALIDATION',
  ToPay = 'TO_PAY',
  Planned = 'PLANNED',
  ArDraft = 'AR_DRAFT',
  Paid = 'PAID',
  MarkedAsPaidByReceiver = 'MARKED_AS_PAID_BY_RECEIVER',
}

export const NInvoiceStatus: any = Object.keys(InvoiceStatus).reduce(
  (o, v, i) => ({ ...o, [InvoiceStatus[v as any]]: i }),
  {},
);

export interface IInvoice {
  id: string;
  status: string;
  estimatedBalance: number;
  paymentAt: Date;
  filename: string;
  filepath: string;
  purchaseAccount: IAccountingPreference;
  history: IHistories;
  importAt: Date;
  createdBy: IUser;
  importedBy: IUser;
  companyEmitter: ICompany;
  companyReceiver: ICompany;
  receiverTitle: string;
  emitterTitle: string;
  number: string;
  iban: IIban;
  currency: string;
  total: number;
  totalWoT: number;
  dueDate: Date;
  invoiceDate: Date;
  enabled: boolean;
  error: boolean;
  ocrStatus: string;
  ocrPartner: string;
  ocrSirenFeedback: any;
  ocrFeedback: any;
  createdAt: Date;
  updatedAt: Date;

  companyEmitterId?: string;
  companyEmitterDetails?: any;
  companyEmitterContactDetails?: any;
  companyReceiverId?: string;
  companyReceiverDetails?: any;

  documentType?: string;
  invoiceDescription?: string;
  discount?: number;
  templateId?: number;
  displayLegalNotice?: any;
  vatAmounts?: any;
  products?: any;
  arCreatedById?: string;
  source?: string;
}

export interface IInvoiceInput {
  file: File;
}

export interface IUpdateInvoiceInput {
  receiverTitle?: string;
  number?: string;
  purchaseAccount?: string;
  iban?: string;
  currency?: string;
  total: number;
  totalWoT?: number;
  dueDate: Date;
  invoiceDate?: Date;
  companyEmitter?: IInputCompany;
  ocrSirenFeedback?: any;
  ocrFeedback?: any;

  companyEmitterId?: string;
  companyEmitterDetails?: any;
  companyEmitterContactDetails?: any;
  companyReceiverId?: string;
  companyReceiverDetails?: any;

  emitterTitle?: string;
  documentType?: string;
  invoiceDescription?: string;
  discount?: number;
  templateId?: number;
  displayLegalNotice?: any;
  vatAmounts?: any;
  products?: any;
  arCreatedById?: string;
  source?: string;
  status?: string;
}
