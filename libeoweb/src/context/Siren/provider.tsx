import { ApolloClient } from 'apollo-client';
import { ISearchParamType } from 'context/Common/types';
import * as React from 'react';
import { compose, graphql, withApollo } from 'react-apollo';
import { ISirenContextInterface, Provider } from './context';
import { companyWithComplementaryInfos, searchCompanies } from './queries';

interface IState extends ISirenContextInterface {}

interface IProps {
  dataSiren: any;
  limit: number;
  offset: number;
  children: React.ReactNode;
  client: ApolloClient<any>;
}

class CompanyContextProvider extends React.PureComponent<IProps, IState> {
  state = {
    siren: {
      complementaryInfos: async (siren: string) => {
        try {
          const { data } = await this.props.client.query({
            query: companyWithComplementaryInfos,
            variables: { siren },
          });

          return data.companyWithComplementaryInfos;
        } catch (e) {
          return null;
        }
      },
      data: undefined,
      more: (params?: ISearchParamType) => {
        const { dataSiren } = this.props;
        const length =
          dataSiren.searchCompanies.rows &&
          dataSiren.searchCompanies &&
          dataSiren.searchCompanies.rows &&
          dataSiren.searchCompanies.rows.length;

        dataSiren &&
          dataSiren.fetchMore &&
          dataSiren.fetchMore({
            updateQuery: (prev: any, { fetchMoreResult }: any) => {
              if (!fetchMoreResult.searchCompanies) {
                return prev;
              }

              return {
                searchCompanies: {
                  ...prev.searchCompanies,
                  rows: [
                    ...prev.searchCompanies.rows,
                    ...fetchMoreResult.searchCompanies.rows,
                  ],
                  total: fetchMoreResult.searchCompanies.total,
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
    const { siren } = this.state;
    const { dataSiren } = this.props;

    return (
      <Provider
        value={{
          siren: {
            ...siren,
            data: dataSiren,
          },
        }}
      >
        {this.props.children}
      </Provider>
    );
  }
}

const searchCompaniesHandler = {
  options: (props: any) => {
    return {
      variables: {
        query: props.value,
      },
    };
  },
  props: (props: any) => {
    return {
      dataSiren: props.data,
    };
  },
  skip: (props: any) =>
    typeof props.value === 'undefined' || props.value === '',
};

export default compose(
  withApollo,
  graphql(searchCompanies, searchCompaniesHandler),
)(CompanyContextProvider);
