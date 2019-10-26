import { ApolloClient } from 'apollo-client';
import * as Alert from 'context/Alert';
import { ISearchParamType } from 'context/Common/types';
import * as User from 'context/User';
import * as React from 'react';
import { compose, graphql, withApollo } from 'react-apollo';
import { IPartnersContextInterface, Provider } from './context';
import { partners } from './queries';

interface IState extends IPartnersContextInterface {}

interface IProps extends Alert.InjectedProps, User.InjectedProps {
  createPartner: any;
  dataPartners: any;
  limit: number;
  offset: number;
  children: React.ReactNode;
  client: ApolloClient<any>;
}

class PartnersContextProvider extends React.PureComponent<IProps, IState> {
  state = {
    partners: {
      data: {
        variables: {},
      },
      more: (params?: ISearchParamType) => {
        const { dataPartners } = this.props;
        const length =
          dataPartners.partners.rows &&
          dataPartners.partners &&
          dataPartners.partners.rows &&
          dataPartners.partners.rows.length;

        dataPartners &&
          dataPartners.fetchMore &&
          dataPartners.fetchMore({
            updateQuery: (prev: any, { fetchMoreResult }: any) => {
              if (!fetchMoreResult.partners) {
                return prev;
              }

              return {
                partners: {
                  ...prev.partners,
                  rows: [
                    ...prev.partners.rows,
                    ...fetchMoreResult.partners.rows,
                  ],
                  total: fetchMoreResult.partners.total,
                },
              };
            },
            variables: {
              limit: 10,
              offset: length || 0,
            },
          });
      },
    },
  };

  render() {
    return (
      <Provider
        value={{
          partners: {
            ...this.state.partners,
            data: this.props.dataPartners,
          },
        }}
      >
        {this.props.children}
      </Provider>
    );
  }
}

const partnersHandler = {
  options: (props: any) => {
    return {
      fetchPolicy: 'network-only',
      variables: {
        limit: props.limit,
        offset: props.offset,
      },
    };
  },
  props: (props: any) => {
    return {
      dataPartners: props.data,
    };
  },
};

export default compose(
  withApollo,
  Alert.hoc(),
  User.hoc(),
  graphql(partners, partnersHandler),
)(PartnersContextProvider);
