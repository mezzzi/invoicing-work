import * as React from 'react';
import {
  AccountingPreferenceType,
  IAccountingPreferenceInput,
  IAccountingPreferences,
} from './types';

interface IAccountingInterface {
  createOrUpdateAccountingPreferences: (
    inputAddress: IAccountingPreferenceInput[],
    type: AccountingPreferenceType,
  ) => Promise<IAccountingPreferences | null>;
  export: () => Promise<string | void>;
  preferences?: IAccountingPreferences;
  accountingExports?: any;
}

export interface IAccountingContextInterface {
  accounting?: IAccountingInterface;
}

const { Provider, Consumer } = React.createContext<IAccountingContextInterface>(
  {
    accounting: {
      accountingExports: undefined,
      createOrUpdateAccountingPreferences: async () => null,
      export: async () => undefined,
      preferences: undefined,
    },
  },
);

export { Provider, Consumer };
