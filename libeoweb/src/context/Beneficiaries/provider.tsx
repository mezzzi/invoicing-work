import { ApolloClient } from 'apollo-client';
import * as Alert from 'context/Alert';
import * as React from 'react';
import { compose, graphql, withApollo } from 'react-apollo';
import { IBeneficiariesContextInterface, Provider } from './context';
import {
  beneficiaries,
  createBeneficiary,
  removeBeneficiary,
  removeDocument,
  representatives,
} from './queries';
import { IBeneficiary, IBeneficiaryInput, IDocument } from './types';

interface IState extends IBeneficiariesContextInterface {}

interface IProps extends Alert.InjectedProps {
  beneficiaries: boolean;
  children: React.ReactNode;
  client: ApolloClient<any>;
  createBeneficiary: any;
  dataBeneficiaries?: any;
  dataRepresentatives?: any;
  removeDocument: any;
  removeBeneficiary: any;
  representatives: boolean;
}

class CompanyContextProvider extends React.PureComponent<IProps, IState> {
  state = {
    beneficiaries: {
      create: async (
        input: IBeneficiaryInput,
      ): Promise<IBeneficiary | null> => {
        if (
          input.country === 'US' ||
          input.birthCountry === 'US' ||
          input.nationality === 'US'
        ) {
          input.specifiedUSPerson = 1;
        } else {
          input.specifiedUSPerson = 0;
        }
        try {
          const results = await this.props.createBeneficiary({
            update: (cache: any, { data }: any) => {
              if (!input.userId) {
                const cached = cache.readQuery({
                  query: beneficiaries,
                  variables: {
                    limit: 100,
                    offset: 0,
                  },
                });

                cache.writeQuery({
                  data: {
                    beneficiaries: {
                      ...cached.beneficiaries,
                      rows: [data.createBeneficiary].concat(
                        cached.beneficiaries.rows,
                      ),
                      total: cached.beneficiaries.total + 1,
                    },
                  },
                  query: beneficiaries,
                  variables: {
                    limit: 100,
                    offset: 0,
                  },
                });
              }
            },
            variables: { input },
          });

          const beneficiary: IBeneficiary = results.data.createBeneficiary;
          if (results.errors) {
            return null;
          }
          return beneficiary;
        } catch (e) {
          return null;
        }
      },
      remove: async (id: number) => {
        try {
          await this.props.removeBeneficiary({
            variables: { id },
          });
        } catch (e) {}
      },
      removeDocument: async (documentId: number): Promise<IDocument | null> => {
        try {
          const { errors, data } = await this.props.removeDocument({
            variables: { id: documentId },
          });
          if (errors) {
            return null;
          }
          return data.removeDocument;
        } catch (e) {
          return null;
        }
      },
    },
  };

  render() {
    const { dataRepresentatives, dataBeneficiaries } = this.props;

    return (
      <Provider
        value={{
          beneficiaries: {
            ...this.state.beneficiaries,
            beneficiaries: dataBeneficiaries ? dataBeneficiaries : undefined,
            representatives: dataRepresentatives
              ? dataRepresentatives
              : undefined,
          },
        }}
      >
        {this.props.children}
      </Provider>
    );
  }
}

const representativesHandler = {
  props: (props: any) => {
    return {
      dataRepresentatives: props.data,
    };
  },
  skip: (props: any) => !props.representatives,
};

const beneficiariesHandler = {
  options: (props: any) => {
    return {
      variables: {
        limit: 100,
        offset: 0,
      },
    };
  },
  props: (props: any) => {
    return {
      dataBeneficiaries: props.data,
    };
  },
  skip: (props: any) => !props.beneficiaries,
};

export default compose(
  withApollo,
  Alert.hoc(),
  graphql(beneficiaries, beneficiariesHandler),
  graphql(representatives, representativesHandler),
  graphql(removeBeneficiary, {
    name: 'removeBeneficiary',
  }),
  graphql(createBeneficiary, {
    name: 'createBeneficiary',
  }),
  graphql(removeDocument, {
    name: 'removeDocument',
  }),
)(CompanyContextProvider as any);
