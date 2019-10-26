import * as React from 'react';
import { IIbans } from './types';

interface IIbanInterface {
  ibans?: IIbans;
}

export interface IIbanContextInterface {
  iban?: IIbanInterface;
}

const { Provider, Consumer } = React.createContext<IIbanContextInterface>({
  iban: {
    ibans: undefined,
  },
});

export { Provider, Consumer };
