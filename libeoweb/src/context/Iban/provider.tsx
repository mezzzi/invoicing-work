import { ApolloClient } from 'apollo-client';
import * as Alert from 'context/Alert';
import * as User from 'context/User';
import * as React from 'react';
import { compose, graphql, withApollo } from 'react-apollo';
import { IIbanContextInterface, Provider } from './context';
import { ibans } from './queries';
import { IIban } from './types';

interface IState extends IIbanContextInterface {
  ibans?: IIban[];
}

interface IProps extends Alert.InjectedProps, User.InjectedProps {
  ibans: any;
  siren: string;
  dataIbans: any;
  children: React.ReactNode;
  client: ApolloClient<any>;
}

class PartnersContextProvider extends React.PureComponent<IProps, IState> {
  state = {
    iban: {
      ibans: undefined,
    },
  };

  render() {
    const { dataIbans } = this.props;

    return (
      <Provider
        value={{
          iban: {
            ibans: dataIbans && dataIbans.ibans,
          },
        }}
      >
        {this.props.children}
      </Provider>
    );
  }
}

const ibansHandler = {
  options: (props: any) => {
    return {
      fetchPolicy: 'network-only',
      variables: {
        siren: props.siren,
      },
    };
  },
  props: (props: any) => {
    return {
      dataIbans: props.data,
    };
  },
  skip: (props: any) => !props.siren,
};

export default compose(
  withApollo,
  Alert.hoc(),
  graphql(ibans, ibansHandler),
)(PartnersContextProvider);
