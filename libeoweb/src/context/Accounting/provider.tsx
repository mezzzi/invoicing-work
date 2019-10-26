import { ApolloClient } from 'apollo-client';
import * as Alert from 'context/Alert';
import * as User from 'context/User';
import * as React from 'react';
import { compose, graphql, withApollo } from 'react-apollo';
import { errorOrSuccess, parseError } from 'utils';
import { IAccountingContextInterface, Provider } from './context';
import {
  accountingExport,
  accountingExports,
  accountingPreferences,
  createOrUpdateAccountingPreferences,
} from './queries';
import { AccountingPreferenceType, IAccountingPreferenceInput } from './types';

interface IState extends IAccountingContextInterface {}

interface IProps extends Alert.InjectedProps, User.InjectedProps {
  export: boolean;
  accountingExport: any;
  createOrUpdateAccountingPreferences: any;
  dataPreferences: any;
  dataExports: any;
  children: React.ReactNode;
  client: ApolloClient<any>;
  types: AccountingPreferenceType[];
  common: boolean;
}

class PartnersContextProvider extends React.PureComponent<IProps, IState> {
  state = {
    accounting: {
      accountingExports: undefined,
      createOrUpdateAccountingPreferences: async (
        input: IAccountingPreferenceInput[],
        type: AccountingPreferenceType,
      ) => {
        try {
          const results = await this.props.createOrUpdateAccountingPreferences({
            variables: { input },
          });
          this.props.dataPreferences.refetch();

          return results.data;
        } catch (e) {
          errorOrSuccess(this.props.alert, parseError(e));
        }
        return null;
      },
      export: async () => {
        const { data } = await this.props.accountingExport();

        return data && data.export;
      },
      preferences: undefined,
    },
  };

  render() {
    const { dataPreferences, dataExports } = this.props;

    return (
      <Provider
        value={{
          accounting: {
            ...this.state.accounting,
            accountingExports: dataExports,
            preferences:
              dataPreferences && dataPreferences.accountingPreferences,
          },
        }}
      >
        {this.props.children}
      </Provider>
    );
  }
}

const accountingPreferencesHandler = {
  options: (props: any) => {
    return {
      fetchPolicy: 'network-only', // should be removed but the accounting preferences options is not well handled
      // accounting option only use custom preferences
      // invoice control use both so when I add a new account in preferences
      // control isn't update
      // QUICK FIX
      variables: {
        default: props.common,
        types: props.types,
      },
    };
  },
  props: (props: any) => {
    return {
      dataPreferences: props.data,
    };
  },
  skip: (props: any) => !props.types,
};

const accountingExportsHandler = {
  options: (props: any) => {
    return {
      variables: {
        limit: props.limit,
        offset: props.offset,
      },
    };
  },
  props: (props: any) => {
    return {
      dataExports: props.data,
    };
  },
  skip: (props: any) => !props.export,
};

export default compose(
  withApollo,
  Alert.hoc(),
  graphql(createOrUpdateAccountingPreferences, {
    name: 'createOrUpdateAccountingPreferences',
  }),
  graphql(accountingPreferences, accountingPreferencesHandler),
  graphql(accountingExports, accountingExportsHandler),
  graphql(accountingExport, { name: 'accountingExport' }),
)(PartnersContextProvider);
