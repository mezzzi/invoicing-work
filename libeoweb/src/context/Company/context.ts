import * as React from 'react';
import { IInputCompany, IKycStatus, IPartnerOrder } from './types';

export interface IPartnersSearchType {
  orderBy?: IPartnerOrder;
  limit?: number;
  offset?: number;
}

interface ICompanyInterface {
  contract: string;
  create: (
    id?: string,
    inputCompany?: IInputCompany,
    message?: string,
  ) => Promise<boolean>;
  getContract: () => Promise<string | undefined>;
  reset: () => void;
  kyc: (status: IKycStatus) => void;
  signContract: () => Promise<string | boolean>;
  step: (status: string) => any;
}

export interface ICompanyContextInterface {
  company?: ICompanyInterface;
}

const { Provider, Consumer } = React.createContext<ICompanyContextInterface>({
  company: {
    contract: '',
    create: async () => false,
    getContract: async () => '',
    kyc: () => {},
    reset: () => {},
    signContract: async () => false,
    step: () => {},
  },
});

export { Provider, Consumer };
