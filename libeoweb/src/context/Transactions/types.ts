import { ITransaction } from '../Transaction/types';

export interface ITransactions {
  total: number;
  rows: ITransaction[];
}
