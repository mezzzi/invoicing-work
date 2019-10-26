import { ApolloClient } from 'apollo-client';
import * as Alert from 'context/Alert';
import * as React from 'react';
import { compose, graphql, withApollo } from 'react-apollo';
import { InjectedIntlProps, injectIntl } from 'react-intl';
import { ITransactionsContextInterface, Provider } from './context';
import { transactions } from './queries';

interface IState extends ITransactionsContextInterface {}

interface IProps extends InjectedIntlProps, Alert.InjectedProps {
  children: React.ReactNode;
  client: ApolloClient<any>;
  dataTransactions: any;
  id: string;
  limit: number;
  page: number;
}

class InvoiceProvider extends React.PureComponent<IProps, IState> {
  state = {
    transactions: {
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
    this.props.dataTransactions.refetch();
  }

  render() {
    const { dataTransactions } = this.props;

    return (
      <Provider
        value={{
          ...this.state,
          transactions: {
            ...this.state.transactions,
            data: dataTransactions,
          },
        }}
      >
        {this.props.children}
      </Provider>
    );
  }
}

const transactionsHandler = {
  options: (props: any) => {
    return {
      fetchPolicy: 'network-only',
      variables: {
        limit: props.limit,
        page: props.page,
      },
    };
  },
  props: (props: any) => {
    return {
      dataTransactions: props.data,
    };
  },
};

export default compose(
  withApollo,
  injectIntl,
  Alert.hoc(),
  graphql(transactions, transactionsHandler),
)(InvoiceProvider as any);
