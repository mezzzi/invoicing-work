import * as React from 'react';

import { ISearchParamType } from '../Common/types';

interface ISirenInterface {
  complementaryInfos: (siren: string) => Promise<any | undefined>;
  data: any;
  more: (params?: ISearchParamType) => void;
}

export interface ISirenContextInterface {
  siren?: ISirenInterface;
}

const { Provider, Consumer } = React.createContext<ISirenContextInterface>({
  siren: {
    complementaryInfos: async () => undefined,
    data: undefined,
    more: () => {},
  },
});

export { Provider, Consumer };
