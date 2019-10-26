import { ApolloClient } from 'apollo-client';
import * as Alert from 'context/Alert';
import * as User from 'context/User';
import * as React from 'react';
import { compose, graphql, withApollo } from 'react-apollo';
import { errorOrSuccess, parseError } from 'utils';
import { IAddressesContextInterface, Provider } from './context';
import { createOrUpdateAddress } from './queries';
import { IInputAddress } from './types';

interface IState extends IAddressesContextInterface {}

interface IProps extends Alert.InjectedProps, User.InjectedProps {
  createOrUpdateAddress: any;
  children: React.ReactNode;
  client: ApolloClient<any>;
}

class PartnersContextProvider extends React.PureComponent<IProps, IState> {
  state = {
    address: {
      create: async (inputAddress: IInputAddress) => {
        try {
          const results = await this.props.createOrUpdateAddress({
            variables: { input: inputAddress },
          });
          errorOrSuccess(
            this.props.alert,
            [],
            [
              inputAddress.id
                ? 'addresses.form.success_updated'
                : 'addresses.form.success_add',
            ],
          );
        } catch (e) {
          errorOrSuccess(this.props.alert, parseError(e));
        }
      },
    },
  };

  render() {
    return (
      <Provider
        value={{
          address: {
            ...this.state.address,
          },
        }}
      >
        {this.props.children}
      </Provider>
    );
  }
}

export default compose(
  withApollo,
  Alert.hoc(),
  graphql(createOrUpdateAddress, { name: 'createOrUpdateAddress' }),
  // graphql(updateAddress, { name: 'updateAddress' })
)(PartnersContextProvider);
