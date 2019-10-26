import { ApolloClient } from 'apollo-client';
import * as Alert from 'context/Alert';
import { createContact } from 'context/Contacts/queries';
import * as User from 'context/User';
import * as React from 'react';
import { compose, graphql, withApollo } from 'react-apollo';
import { errorOrSuccess, parseError } from 'utils';
import { ICompanyContextInterface, Provider } from './context';
import {
  contract,
  createOrUpdateCompany,
  signContract,
  updateKycStatus,
  updateKycStep,
} from './queries';
import { ICompany, IInputCompany, IKycStatus } from './types';

interface IState extends ICompanyContextInterface {}

interface IProps extends Alert.InjectedProps, User.InjectedProps {
  createOrUpdateCompany: any;
  createContact: any;
  updateKycStatus: any;
  updateKycStep: any;
  children: React.ReactNode;
  contract?: boolean;
  dataContract?: any;
  signContract?: any;
  client: ApolloClient<any>;
}

class CompanyContextProvider extends React.PureComponent<IProps, IState> {
  state = {
    company: {
      contract: '',
      create: async (
        id?: string,
        inputCompany?: IInputCompany,
        message?: string,
      ): Promise<boolean> => {
        const user: any = this.props.user;
        try {
          const { data, errors } = await this.props.createOrUpdateCompany({
            variables: { id, input: inputCompany },
          });
          if (user && user.data) {
            await user.data.refetch();
          }

          if (errors) {
            errorOrSuccess(this.props.alert, parseError(errors));
            return false;
          } else {
            user && user.data && user.data.refetch();
            return true;
          }
        } catch (e) {
          errorOrSuccess(this.props.alert, parseError(e));
        }
        return false;
      },
      getContract: async () => {
        const result: any = await this.props.client.query({
          query: contract,
        });

        if (result && result.data && result.data.contract) {
          return result.data.contract;
        }
      },
      kyc: async (status: IKycStatus) => {
        const user: any = this.props.user;
        try {
          const result: any = await this.props.updateKycStatus({
            variables: { status },
          });

          if (result.errors) {
            return result;
          }

          user && user.refresh();
          return result;
        } catch (e) {
          errorOrSuccess(this.props.alert, parseError(e));
        }
      },
      reset: () => {},
      signContract: async () => {
        try {
          const { data } = await this.props.signContract({
            variables: {},
          });

          return data && data.signContract ? true : false;
        } catch (e) {
          errorOrSuccess(this.props.alert, parseError(e));
        }
        return false;
      },
      step: async (step: string) => {
        const { user } = this.props;
        const currentCompany: ICompany =
          user && user.data && user.data.me && user.data.me.currentCompany;
        if (currentCompany && currentCompany.kycStep === step) {
          return;
        }
        try {
          await this.props.updateKycStep({
            variables: { step },
          });
        } catch (e) {
          errorOrSuccess(this.props.alert, parseError(e));
        }
      },
    },
  };

  render() {
    const { company } = this.state;
    const { dataContract } = this.props;

    return (
      <Provider
        value={{
          company: {
            ...company,
            contract:
              dataContract && dataContract.contract
                ? dataContract.contract
                : '',
          },
        }}
      >
        {this.props.children}
      </Provider>
    );
  }
}

const contractHandler = {
  props: (props: any) => {
    return {
      dataContract: props.data,
    };
  },
  skip: (props: any) => props.contract !== true,
};

export default compose(
  withApollo,
  Alert.hoc(),
  User.hoc(),
  graphql(contract, contractHandler),
  graphql(updateKycStep, { name: 'updateKycStep' }),
  graphql(signContract, { name: 'signContract' }),
  graphql(updateKycStatus, { name: 'updateKycStatus' }),
  graphql(createOrUpdateCompany, { name: 'createOrUpdateCompany' }),
  graphql(createContact, { name: 'createContact' }),
)(CompanyContextProvider as any);
