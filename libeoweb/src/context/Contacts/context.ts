import * as React from 'react';
import { IContact, IInputContact } from './types';

interface IContactsInterface {
  create: (inputContact: IInputContact) => Promise<IContact | null>;
  update: (id: string, inputContact: IInputContact) => void;
}

export interface IContactsContextInterface {
  contact?: IContactsInterface;
}

const { Provider, Consumer } = React.createContext<IContactsContextInterface>({
  contact: {
    create: async () => null,
    update: () => {},
  },
});

export { Provider, Consumer };
