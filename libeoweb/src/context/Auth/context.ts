import * as React from 'react';
import { IUser } from '../User/types';

const authSkeleton = {
  activate: async (confirmationToken: string) => false,
  resendActivate: async (email: string) => false,
  reset: () => {},
  resetPassword: async (
    password: string,
    confirmPassword: string,
    confirmationToken: string,
  ) => false,
  resetPasswordRequest: async (email: string) => false,
  signin: async (user: IUser): Promise<string | undefined> => undefined,
  signout: async () => false,
  signup: async (user: IUser) => false,
  token: null as string | null,
};

export type IAuthInterface = typeof authSkeleton;

export interface IAuthContextInterface {
  auth?: IAuthInterface;
}

const { Provider, Consumer } = React.createContext<IAuthContextInterface>({
  auth: authSkeleton,
});

export { Provider, Consumer };
