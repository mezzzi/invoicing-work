import { IInvoice } from '../Invoice/types';

export interface IInvoices {
  total: number;
  rows: IInvoice[];
}
