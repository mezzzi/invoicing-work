import * as React from 'react';

export interface IBalanceInterface {
  checkBalance: (id: string, paymentAt: Date) => Promise<boolean>;
  data: any;
  refresh: () => void;
}

export interface IBalanceContextInterface {
  balance?: IBalanceInterface;
}

const { Provider, Consumer } = React.createContext<IBalanceContextInterface>({
  balance: {
    checkBalance: async () => false,
    data: {},
    refresh: () => {},
  },
});

export { Provider, Consumer };
