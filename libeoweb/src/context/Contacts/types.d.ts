import { ICompany } from 'context/Company/types.d';
import { IEmail } from 'context/Emails/types';
import { IUser } from 'context/User/types';

export interface IContact {
  id: string;
  firstname: string;
  lastname: string;
  user: IUser;
  company: ICompany;
  emails?: {
    total: number;
    rows: IEmail[];
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface IInputContact {
  id?: string;
  firstname: string;
  lastname: string;
  companyId?: string;
  emails?: IEmail[];
}
