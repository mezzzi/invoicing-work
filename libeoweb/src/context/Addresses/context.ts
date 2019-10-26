import * as React from 'react';
import { IInputAddress } from './types';

interface IAddressesInterface {
  create: (inputAddress: IInputAddress) => void;
}

export interface IAddressesContextInterface {
  address?: IAddressesInterface;
}

const { Provider, Consumer } = React.createContext<IAddressesContextInterface>({
  address: {
    create: () => {},
  },
});

export { Provider, Consumer };
