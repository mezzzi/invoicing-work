import * as React from 'react';
import { IInputPartner } from './types';

interface IPartnerInterface {
  create: (obj: IInputPartner, partnersVariables: any) => any;
  data?: any;
}

export interface IPartnerContextInterface {
  partner?: IPartnerInterface;
}

const { Provider, Consumer } = React.createContext<IPartnerContextInterface>({
  partner: {
    create: () => {},
    data: {},
  },
});

export { Provider, Consumer };
