import { ApolloClient } from 'apollo-client';
import * as Alert from 'context/Alert';
import * as User from 'context/User';
import * as React from 'react';
import { compose, graphql, withApollo } from 'react-apollo';
import { errorOrSuccess, parseError } from 'utils';
import { IBanksContextInterface, Provider } from './context';
import {
  bankAccount,
  bankAccounts,
  changeDefaultBankAccount,
  createMandate,
  createOrUpdateBankAccount,
  generateCodeMandate,
  removeBankAccount,
  removeMandate,
  signedMandate,
} from './queries';
import { IBankAccount, IInputBankAccount, IMandate } from './types';

interface IState extends IBanksContextInterface {}

interface IProps extends Alert.InjectedProps, User.InjectedProps {
  list: boolean;
  createOrUpdateBankAccount: any;
  createMandate: any;
  changeDefaultBankAccount: any;
  generateCodeMandate: any;
  signedMandate: any;
  removeBankAccount: any;
  removeMandate: any;
  dataBankAccounts: any;
  dataBankAccount: any;
  children: React.ReactNode;
  client: ApolloClient<any>;
}

class PartnersContextProvider extends React.PureComponent<IProps, IState> {
  state = {
    bank: {
      bankAccount: undefined,
      bankAccounts: undefined,
      changeDefaultBankAccount: async (
        id: string,
      ): Promise<IBankAccount[] | undefined> => {
        try {
          const result = await this.props.changeDefaultBankAccount({
            variables: { id },
          });
          errorOrSuccess(this.props.alert, parseError(result.errors), [
            'bank.form.success_change_default',
          ]);
          return result.data && result.data.changeDefaultBankAccount;
        } catch (e) {
          errorOrSuccess(this.props.alert, parseError(e));
        }
      },
      createMandate: async (bankAccountId?: string) => {
        try {
          const result = await this.props.createMandate({
            variables: { bankAccountId },
          });
          errorOrSuccess(this.props.alert, parseError(result.errors), [
            'bank.mandate.success_create',
          ]);
          return result.data && result.data.createMandate;
        } catch (e) {
          errorOrSuccess(this.props.alert, parseError(e));
        }
      },
      createOrUpdate: async (
        inputBankAccount: IInputBankAccount,
        id?: string,
      ) => {
        try {
          const result = await this.props.createOrUpdateBankAccount({
            update: (cache: any, { data }: any) => {
              if (!id) {
                const cached = cache.readQuery({
                  query: bankAccounts,
                });

                const newBankAccounts = {
                  ...(cached ? cached.bankAccounts : {}),
                  rows: [data.createOrUpdateBankAccount].concat(
                    ...(cached && cached.bankAccounts
                      ? cached.bankAccounts.rows
                      : []),
                  ),
                  total:
                    cached && cached.bankAccounts
                      ? cached.bankAccounts.total + 1
                      : 1,
                };

                cache.writeQuery({
                  data: {
                    bankAccounts: newBankAccounts,
                  },
                  query: bankAccounts,
                });
              }
            },
            variables: { input: inputBankAccount, id },
          });

          errorOrSuccess(this.props.alert, parseError(result.errors), [
            id ? 'bank.form.success_updated' : 'bank.form.success_add',
          ]);
          return result.data && result.data.createOrUpdateBankAccount;
        } catch (e) {
          errorOrSuccess(this.props.alert, parseError(e));
        }
      },
      generateCode: async (mandateId: string): Promise<boolean | null> => {
        try {
          const result = await this.props.generateCodeMandate({
            variables: { id: mandateId },
          });
          return !result.errors;
        } catch (e) {
          errorOrSuccess(this.props.alert, parseError(e));
        }
        return null;
      },
      removeBankAccount: async (id: string): Promise<IBankAccount | null> => {
        try {
          const result = await this.props.removeBankAccount({
            variables: { id },
          });
          errorOrSuccess(this.props.alert, parseError(result.errors), [
            'bank.row.success_remove',
          ]);
          return result.data && result.data.removeBankAccount;
        } catch (e) {
          errorOrSuccess(this.props.alert, parseError(e));
        }
        return null;
      },
      removeMandate: async (id: string): Promise<IMandate | null> => {
        try {
          const result = await this.props.removeMandate({
            variables: { id },
          });
          errorOrSuccess(this.props.alert, parseError(result.errors), [
            'bank.mandate.success_remove',
          ]);
          return result.data && result.data.removeMandate;
        } catch (e) {
          errorOrSuccess(this.props.alert, parseError(e));
        }
        return null;
      },
      sign: async (
        mandateId: string,
        code: string,
      ): Promise<IMandate | null> => {
        try {
          const result = await this.props.signedMandate({
            variables: { id: mandateId, code },
          });
          errorOrSuccess(this.props.alert, parseError(result.errors), [
            'bank.mandate.success_sign',
          ]);
          return result.data && result.data.signedMandate;
        } catch (e) {
          errorOrSuccess(this.props.alert, parseError(e));
        }
        return null;
      },
    },
  };

  render() {
    const { dataBankAccounts, dataBankAccount } = this.props;

    return (
      <Provider
        value={{
          bank: {
            ...this.state.bank,
            bankAccount: dataBankAccount,
            bankAccounts: dataBankAccounts,
          },
        }}
      >
        {this.props.children}
      </Provider>
    );
  }
}

const bankAccountsHandler = {
  props: (props: any) => {
    return {
      dataBankAccounts: props.data,
    };
  },
  skip: (props: any) => !props.list,
};

const bankAccountHandler = {
  options: (props: any) => {
    return {
      variables: {
        id: props.id,
      },
    };
  },
  props: (props: any) => {
    return {
      dataBankAccount: props.data,
    };
  },
  skip: (props: any) => !props.id,
};

export default compose(
  withApollo,
  Alert.hoc(),
  graphql(createOrUpdateBankAccount, { name: 'createOrUpdateBankAccount' }),
  graphql(createMandate, { name: 'createMandate' }),
  graphql(changeDefaultBankAccount, { name: 'changeDefaultBankAccount' }),
  graphql(generateCodeMandate, { name: 'generateCodeMandate' }),
  graphql(signedMandate, { name: 'signedMandate' }),
  graphql(removeBankAccount, { name: 'removeBankAccount' }),
  graphql(removeMandate, { name: 'removeMandate' }),
  graphql(bankAccounts, bankAccountsHandler),
  graphql(bankAccount, bankAccountHandler),
)(PartnersContextProvider);
