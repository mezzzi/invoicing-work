import { ApolloClient } from 'apollo-client';
import * as Auth from 'context/Auth';
import * as React from 'react';
import { compose, graphql, withApollo } from 'react-apollo';
import { InjectedIntlProps, injectIntl } from 'react-intl';
import { RouteComponentProps, withRouter } from 'react-router';
import { IUserContextInterface, Provider } from './context';
import { getMe, updateUser } from './queries';

interface IState extends IUserContextInterface {}

interface IProps
  extends InjectedIntlProps,
    Auth.InjectedProps,
    RouteComponentProps {
  token: any;
  dataMe: any;
  updateUser: any;
  getMe: any;
  children: React.ReactNode;
  client: ApolloClient<any>;
}

class UserProvider extends React.PureComponent<IProps, IState> {
  state = {
    user: {
      data: {},
      refresh: async () => {
        const { dataMe } = this.props;
        const newMe = await dataMe.refetch();
        return newMe.data.me;
      },
      reset: () => {},
      updateUser: async () => null,
    },
  };

  render() {
    const { dataMe } = this.props;

    return (
      <Provider
        value={{
          user: {
            ...this.state.user,
            data: dataMe,
            updateUser: this.props.updateUser,
          },
        }}
      >
        {this.props.children}
      </Provider>
    );
  }
}

const getMeHandler = {
  options: (props: any) => {
    return {
      fetchPolicy: 'network-only',
      variables: {},
    };
  },
  props: (props: any) => {
    return {
      dataMe: props.data,
    };
  },
  skip: (props: any) =>
    typeof props.token === 'undefined' || props.token === null,
};

export default compose(
  withApollo,
  injectIntl,
  withRouter,
  Auth.hoc(),
  graphql(getMe, getMeHandler),
  graphql(updateUser, { name: 'updateUser' }),
)(UserProvider as any);
