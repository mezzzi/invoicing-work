import { ICompany, IInputCompany } from 'context/Company/types.d';

export enum ICompanyStatus {
  unknown = 'UNKNOW',
  exist = 'EXIST',
  already = 'ALREADY',
  self = 'SELF',
}

export enum IPartnerOrder {
  createdAt_ASC = 'createdAt_ASC',
  createdAt_DESC = 'createdAt_DESC',
  updatedAt_ASC = 'updatedAt_ASC',
  updatedAt_DESC = 'updatedAt_DESC',
}

export interface IPartner extends ICompany {}
export interface IInputPartner extends IInputCompany {}
