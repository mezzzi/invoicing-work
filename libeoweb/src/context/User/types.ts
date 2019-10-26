import { ICompanies, ICompany } from 'context/Company/types.d';
export interface IUser {
  id?: number;
  firstname?: string;
  lastname?: string;
  email: string;
  password?: string;
  token?: string;
  lastLogin?: Date;
  lastCguAccept?: Date;
  currentCompany: ICompany;
  companies: ICompanies;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IUserInput {
  firstname?: string;
  lastname?: string;
  password?: string;
}
