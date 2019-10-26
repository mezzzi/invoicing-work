import { IUser } from 'context/User/types';

export enum IOrder {
  createdAt_ASC = 'createdAt_ASC',
  createdAt_DESC = 'createdAt_DESC',
  updatedAt_ASC = 'updatedAt_ASC',
  updatedAt_DESC = 'updatedAt_DESC',
}

export interface ISearchParamType {
  orderBy?: IOrder;
  limit?: number;
  offset?: number;
}

export enum HistoryEvent {
  UPDATE_STATUS,
}

export interface IHistory {
  id: string;
  event: HistoryEvent;
  params: any;
  user: IUser;
  createdAt: Date;
  updatedAt: Date;
}

export interface IHistories {
  total: number;
  rows: IHistory[];
}

export enum OnboardingStep {
  Welcome = 'Welcome',
  CreateCompany = 'CreateCompany',
  Sign = 'Sign',
  Beneficiary = 'Beneficiary',
  Transfer = 'Transfer',
  Summary = 'Summary',
}
