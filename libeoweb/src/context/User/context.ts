import * as React from 'react';
import { IUser } from './types';

export interface IUserInterface {
  data: any;
  refresh?: () => Promise<IUser | null>;
  reset: () => void;
  updateUser: (props: any) => Promise<any | null>;
}

export interface IUserContextInterface {
  user?: IUserInterface;
}

const { Provider, Consumer } = React.createContext<IUserContextInterface>({
  user: {
    data: {},
    refresh: async () => null,
    reset: () => {},
    updateUser: async () => null,
  },
});

export { Provider, Consumer };
