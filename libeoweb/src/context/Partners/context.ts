import * as React from 'react';

import { ISearchParamType } from '../Common/types';

interface IPartnersInterface {
  data?: any;
  more: (params?: ISearchParamType) => void;
}

export interface IPartnersContextInterface {
  partners?: IPartnersInterface;
}

const { Provider, Consumer } = React.createContext<IPartnersContextInterface>({
  partners: {
    data: {},
    more: () => {},
  },
});

export { Provider, Consumer };
