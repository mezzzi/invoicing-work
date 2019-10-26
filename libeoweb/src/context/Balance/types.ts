export interface IBalance {
  walletId: number;
  currentBalance: number;
  authorizations: number;
  authorizedBalance: number;
  currency: string;
  calculationDate: string;
}
