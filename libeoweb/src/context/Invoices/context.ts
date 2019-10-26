import { ISearchParamType } from 'context/Common/types';
import { IInvoice, InvoiceStatus } from 'context/Invoice/types';
import * as React from 'react';

export interface IInvoicesSearchType {
  // orderBy?: IPartnerOrder;
  limit?: number;
  offset?: number;
}

export interface IInvoicesInterface {
  count: any;
  data: any;
  delete: (selectedInvoices: IInvoice[], message?: string) => void;
  loading: boolean;
  more: (params?: ISearchParamType) => void;
  // refresh: () => void;
  updateStatus: (
    id: string,
    status: InvoiceStatus,
    message?: string,
  ) => Promise<IInvoice | undefined>;
}

export interface IInvoicesContextInterface {
  invoices?: IInvoicesInterface;
  shouldPoll: boolean;
}

const { Provider, Consumer } = React.createContext<IInvoicesContextInterface>({
  invoices: {
    count: {},
    data: {},
    delete: () => {},
    loading: false,
    more: () => {},
    // refresh: () => {},
    updateStatus: async () => undefined,
  },
  shouldPoll: false,
});

export { Provider, Consumer };
