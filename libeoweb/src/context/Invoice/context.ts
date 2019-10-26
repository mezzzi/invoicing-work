import * as React from 'react';
import { IInvoice, InvoiceStatus, IUpdateInvoiceInput } from './types';

export interface IInvoiceInterface {
  data: any;
  delete: (id: string) => void;
  generateCode: (invoiceId: string) => void;
  payout: (
    invoiceId: string,
    date?: Date,
    code?: string,
  ) => Promise<IInvoice[] | undefined>;
  payoutContacts: (invoiceId: string, contactsIds?: string[]) => void;
  update: (
    id: string,
    input: IUpdateInvoiceInput,
    message: string,
  ) => Promise<IInvoice | undefined>;
  updateStatus: (
    id: string,
    status: InvoiceStatus,
    message?: string,
  ) => Promise<IInvoice | undefined>;
}

export interface IInvoiceContextInterface {
  invoice?: IInvoiceInterface;
}

const { Provider, Consumer } = React.createContext<IInvoiceContextInterface>({
  invoice: {
    data: {},
    delete: () => {},
    generateCode: () => {},
    payout: async () => undefined,
    payoutContacts: async () => undefined,
    update: async () => undefined,
    updateStatus: async () => undefined,
  },
});

export { Provider, Consumer };
