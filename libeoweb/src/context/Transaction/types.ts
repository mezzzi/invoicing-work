export interface ITransaction {
  amount: string;
  createdDate: string;
  currency: string;
  description: string;
  executionDate: string;
  foreignId: number;
  name: string;
  transactionId: number;
  transactionType: string;
  valueDate: string;
  walletCreditBalance: string;
  walletCreditId: number;
  walletDebitBalance: string;
  walletDebitId: number;
}
