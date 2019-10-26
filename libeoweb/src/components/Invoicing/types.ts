import {
  ICompany as IInvoiceCompany,
  IInputCompany,
} from 'context/Company/types';

export interface IContact {
  id: string;
  firstname: string;
  lastname: string;
  email: string;
}

export interface IProduct {
  id: string;
  name?: string; // < 100 characters
  description?: string; // Description < 150 characters
  vatRate: number; // VAT rate to apply for this product
  price: number; // Unitary price of the product
  quantity: number; // Quantity of product for this invoice
  order: number; // Order in which the product is displayed on the invoice
  totalWithDiscount?: number; // Price after discount
  vatOnTotalWithDiscount?: number; // VAT amount for this product
}

export interface ILegalNotices {
  latePaymentPenality?: boolean;
  earlyPaymentCondition?: boolean;
  vatExemption?: boolean;
  recoveryPenality?: boolean;
  displayRIB?: boolean;
}

export interface IGeneralInfo {
  invoiceTitle?: string;
  invoiceNumber?: string;
  invoiceDate?: string;
  invoiceDueDate?: string;
  invoiceDetails?: string;
  idCreatedBy?: string;
}

export interface IHeaderInfo {
  logoUrl?: string;
  documentType?: string;
  contact?: IContact;
}

export interface IPricingInfo {
  discount?: number;
  vatAllTotal?: number;
  vatAllInPercent?: number;
  totalAllWithoutVat?: number;
  totalAllWithVat?: number;
}

export interface ICompany {
  id?: string;
  name?: string;
  address1?: string;
  address2?: string;
  postCode?: string;
  zipcode?: string;
  city?: string;
  siret?: string;
  siren?: string;
  vatNumber?: string;
}

export interface IInvoiceData {
  currentCompany?: IInvoiceCompany;
  emitterCompany?: ICompany;
  receiverCompany?: ICompany;
  partner?: IInputCompany;
  defaultPartner?: IInvoiceCompany;
  headerInfo?: IHeaderInfo;
  generalInfo?: IGeneralInfo;
  pricingInfo?: IPricingInfo;
  legalNotices?: ILegalNotices;
  templateId?: string;
  arCreatedById?: string;
  invoiceId?: string;
  products?: IProduct[];
}

export interface IAutoSaveInterface {
  updateInvoiceData: (changedValues: IInvoiceData) => void;
  getAutoSavedData: () => IInvoiceData;
}
