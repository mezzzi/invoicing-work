import * as React from 'react';
import { IBeneficiary, IBeneficiaryInput, IDocument } from './types';

interface IBeneficiariesInterface {
  beneficiaries?: any;
  create: (input: IBeneficiaryInput) => Promise<IBeneficiary | null>;
  remove: (id: number) => void;
  removeDocument: (id: number) => Promise<IDocument | null>;
  representatives?: any;
}

export interface IBeneficiariesContextInterface {
  beneficiaries?: IBeneficiariesInterface;
}

const { Provider, Consumer } = React.createContext<
  IBeneficiariesContextInterface
>({
  beneficiaries: {
    create: async () => null,
    remove: () => {},
    removeDocument: async () => null,
    representatives: undefined,
  },
});

export { Provider, Consumer };
