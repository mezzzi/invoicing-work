import { ApolloClient } from 'apollo-client';
import * as Alert from 'context/Alert';
import * as React from 'react';
import { compose, graphql, withApollo } from 'react-apollo';
import { InjectedIntlProps, injectIntl } from 'react-intl';
import { IBalanceContextInterface, Provider } from './context';
import { balance, checkBalance } from './queries';

interface IState extends IBalanceContextInterface {}

interface IProps extends InjectedIntlProps, Alert.InjectedProps {
  children: React.ReactNode;
  client: ApolloClient<any>;
  balance: boolean;
  dataBalance: any;
  id: string;
  limit: number;
  page: number;
}

class InvoiceProvider extends React.PureComponent<IProps, IState> {
  state = {
    balance: {
      checkBalance: async (id: string, paymentAt: Date): Promise<boolean> => {
        try {
          const { data } = await this.props.client.query({
            query: checkBalance,
            variables: { id, paymentAt },
          });
          return (data as any).checkBalance;
        } catch (e) {
          return false;
        }
      },
      data: {},
      refresh: this.refresh.bind(this),
    },
  };

  handleRefresh: () => void;

  constructor(props: any) {
    super(props);

    this.handleRefresh = this.refresh.bind(this);
  }

  refresh() {
    this.props.dataBalance.refetch();
  }

  render() {
    const { dataBalance } = this.props;

    return (
      <Provider
        value={{
          ...this.state,
          balance: {
            ...this.state.balance,
            data: dataBalance,
          },
        }}
      >
        {this.props.children}
      </Provider>
    );
  }
}

const balanceHandler = {
  props: (props: any) => {
    return {
      dataBalance: props.data,
    };
  },
  skip: (props: any) => props.balance !== true,
};

export default compose(
  withApollo,
  injectIntl,
  Alert.hoc(),
  graphql(balance, balanceHandler),
)(InvoiceProvider as any);
