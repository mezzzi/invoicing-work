import * as React from 'react';
import { IBankAccount, IInputBankAccount, IMandate } from './types';

interface IBanksInterface {
  bankAccount?: any;
  bankAccounts?: any;
  changeDefaultBankAccount: (id: string) => Promise<IBankAccount[] | undefined>;
  createMandate: (bankAccountId?: string) => Promise<IMandate | null>;
  createOrUpdate: (
    inputBankAccount: IInputBankAccount,
    id?: string,
  ) => Promise<IBankAccount | null>;
  generateCode: (mandateId: string) => Promise<boolean | null>;
  removeBankAccount: (id: string) => Promise<IBankAccount | null>;
  removeMandate: (id: string) => Promise<IMandate | null>;
  sign: (mandateId: string, code: string) => Promise<IMandate | null>;
}

export interface IBanksContextInterface {
  bank?: IBanksInterface;
}

const { Provider, Consumer } = React.createContext<IBanksContextInterface>({
  bank: {
    bankAccount: undefined,
    bankAccounts: undefined,
    changeDefaultBankAccount: async () => undefined,
    createMandate: async () => null,
    createOrUpdate: async () => null,
    generateCode: async () => null,
    removeBankAccount: async () => null,
    removeMandate: async () => null,
    sign: async () => null,
  },
});

export { Provider, Consumer };
