import * as React from 'react';

export interface ITransactionsSearchType {
  // orderBy?: IPartnerOrder;
  limit?: number;
  page?: number;
}

export interface ITransactionsInterface {
  data: any;
  refresh: () => void;
}

export interface ITransactionsContextInterface {
  transactions?: ITransactionsInterface;
}

const { Provider, Consumer } = React.createContext<
  ITransactionsContextInterface
>({
  transactions: {
    data: {},
    refresh: () => {},
  },
});

export { Provider, Consumer };
