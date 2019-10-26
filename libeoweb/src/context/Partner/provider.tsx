import { ApolloClient } from 'apollo-client';
import * as Alert from 'context/Alert';
import { partner } from 'context/Partners/queries';
import * as User from 'context/User';
import * as React from 'react';
import { compose, graphql, withApollo } from 'react-apollo';
import { IPartnerContextInterface, Provider } from './context';
import { createPartner } from './queries';
import { IInputPartner } from './types';

interface IState extends IPartnerContextInterface {}

interface IProps extends Alert.InjectedProps, User.InjectedProps {
  createPartner: any;
  dataPartner: any;
  limit: number;
  offset: number;
  children: React.ReactNode;
  client: ApolloClient<any>;
}

class PartnerContextProvider extends React.PureComponent<IProps, IState> {
  state = {
    partner: {
      create: async (inputPartner: IInputPartner, partnersVariables: any) => {
        const { dataPartner } = this.props;

        let results;
        const variables =
          partnersVariables || (dataPartner && dataPartner.variables);

        try {
          results = await this.props.createPartner({
            variables: { input: inputPartner },
          });
        } catch (e) {}

        return results;
      },
      data: {},
    },
  };

  render() {
    const { dataPartner } = this.props;

    return (
      <Provider
        value={{
          partner: {
            ...this.state.partner,
            data: dataPartner,
          },
        }}
      >
        {this.props.children}
      </Provider>
    );
  }
}

const partnerHandler = {
  options: (props: any) => {
    return {
      variables: {
        id: props.id,
      },
    };
  },
  props: (props: any) => {
    return {
      dataPartner: props.data,
    };
  },
  skip: (props: any) => typeof props.id === 'undefined',
};

export default compose(
  withApollo,
  Alert.hoc(),
  User.hoc(),
  graphql(partner, partnerHandler),
  graphql(createPartner, { name: 'createPartner' }),
)(PartnerContextProvider);
