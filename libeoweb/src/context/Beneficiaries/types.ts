export enum DocumentStatus {
  PENDING = 'PENDING',
  CANCELED = 'CANCELED',
  VALIDATED = 'VALIDATED',
}

export enum IUserTitle {
  M = 'M',
  MME = 'MME',
  MLLE = 'MLLE',
}

export interface IDocument {
  documentId: number;
  documentTag: string;
  documentStatus: DocumentStatus;
  documentTypeId: number;
  documentType: string;
  residenceId: number;
  clientId: number;
  userId: number;
  userLastname: string;
  userFirstname: string;
  fileName: string;
  temporaryUrl: string;
  temporaryUrlThumb: string;
  createdDate: string;
  modifiedDate: string;
}

export interface IBeneficiary {
  userId: number;
  userTypeId: number;
  userStatus: DocumentStatus;
  userTag: string;
  parentUserId: number;
  parentType: string;
  specifiedUSPerson: number;
  controllingPersonType: number;
  employeeType: number;
  title: IUserTitle | string;
  firstname: string;
  lastname: string;
  middleNames: string;
  birthday: string;
  email: string;
  address1: string;
  address2: string;
  postcode: string;
  city: string;
  state: string;
  country: string;
  countryName: string;
  phone: string;
  mobile: string;
  nationality: string;
  nationalityOther: string;
  placeOfBirth: string;
  birthCountry: string;
  occupation: string;
  incomeRange: string;
  legalName: string;
  legalNameEmbossed: string;
  legalRegistrationNumber: string;
  legalTvaNumber: string;
  legalRegistrationDate: string;
  legalForm: string;
  legalShareCapital: number;
  legalSector: string;
  legalAnnualTurnOver: string;
  legalNetIncomeRange: string;
  legalNumberOfEmployeeRange: string;
  effectiveBeneficiary: number;
  kycLevel: number;
  kycReview: number;
  kycReviewComment: string;
  isFreezed: number;
  language: string;
  optInMailing: number;
  sepaCreditorIdentifier: string;
  taxNumber: string;
  taxResidence: string;
  position: string;
  personalAssets: string;
  createdDate: string;
  modifiedDate: string;
  walletCount: number;
  payinCount: number;
  documents: {
    total: number;
    rows: IDocument[];
  };
  zipcode?: number;
}

export interface IBeneficiaries {
  total: number;
  rows: IBeneficiary[];
}

export interface IRepresentative {
  firstname: string;
  lastname: string;
  fullnames: string;
  birthday: string;
  parentType: string;
  userTypeId: number;
}

export interface IRepresentatives {
  total: number;
  rows: IRepresentative[];
}

export interface IBeneficiaryInput {
  userId?: number;
  userTypeId?: number;
  userStatus?: DocumentStatus;
  userTag?: string;
  parentUserId?: number;
  parentType?: string;
  specifiedUSPerson?: number;
  controllingPersonType?: number;
  employeeType?: number;
  title?: IUserTitle;
  firstname?: string;
  lastname?: string;
  middleNames?: string;
  birthday?: string;
  email?: string;
  address1?: string;
  address2?: string;
  postcode?: string;
  city?: string;
  isCurrentUser?: boolean;
  isHosted?: boolean;
  state?: string;
  country?: string;
  countryName?: string;
  phone?: string;
  mobile?: string;
  nationality?: string;
  nationalityOther?: string;
  placeOfBirth?: string;
  birthCountry?: string;
  occupation?: string;
  incomeRange?: string;
  legalName?: string;
  legalNameEmbossed?: string;
  legalRegistrationNumber?: string;
  legalTvaNumber?: string;
  legalRegistrationDate?: string;
  legalForm?: string;
  legalShareCapital?: number;
  legalSector?: string;
  legalAnnualTurnOver?: string;
  legalNetIncomeRange?: string;
  legalNumberOfEmployeeRange?: string;
  effectiveBeneficiary?: number;
  kycLevel?: number;
  kycReview?: number;
  kycReviewComment?: string;
  isFreezed?: number;
  language?: string;
  optInMailing?: number;
  sepaCreditorIdentifier?: string;
  taxNumber?: string;
  taxResidence?: string;
  position?: string;
  personalAssets?: string;
  createdDate?: string;
  modifiedDate?: string;
  walletCount?: number;
  payinCount?: number;
  documents?: IDocumentInput[];
  zipcode?: number;
  taxInformation?: string;
}

export interface IDocumentInput {
  userId?: number;
  documentTypeId?: number;
  name?: string;
  file?: File;
}
