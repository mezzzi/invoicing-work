import { ApolloClient } from 'apollo-client';
import * as Alert from 'context/Alert';
import * as React from 'react';
import { compose, graphql, withApollo } from 'react-apollo';
import { InjectedIntlProps, injectIntl } from 'react-intl';
import { RouteComponentProps, withRouter } from 'react-router';
import history from 'store/history';
import { errorOrSuccess, parseError } from 'utils';
import { IUser } from '../User/types';
import { IAuthContextInterface, Provider } from './context';
import {
  activateUser,
  refreshConfirmationTokenUser,
  resetPassword,
  resetPasswordRequest,
  signin,
  signout,
  signup,
} from './queries';

interface IState extends IAuthContextInterface {}

interface IProps
  extends InjectedIntlProps,
    Alert.InjectedProps,
    RouteComponentProps {
  activateUser: any;
  signin: any;
  signup: any;
  signout: any;
  children: React.ReactNode;
  client: ApolloClient<any>;
  refreshConfirmationTokenUser: any;
  resetPassword: any;
  resetPasswordRequest: any;
}

class AuthProvider extends React.PureComponent<IProps, IState> {
  state = {
    auth: {
      activate: async (confirmationToken: string) => {
        const { errors, data } = await this.props.activateUser({
          variables: { confirmationToken },
        });

        if (!errors && data.activateUser) {
          return (data as any).activateUser;
        }
      },
      resendActivate: async (email: string) => {
        const { errors, data } = await this.props.refreshConfirmationTokenUser({
          variables: { email },
        });

        if (errors) {
          errorOrSuccess(this.props.alert, parseError(errors));
        } else if (data.refreshConfirmationTokenUser) {
          // history.push('/signup-success');
          return (data as any).refreshConfirmationTokenUser;
        }
      },
      reset: () => {
        const { auth } = this.state;
        this.setState({
          auth: {
            ...auth,
            token: null,
          },
        });
        this.props.client && this.props.client.resetStore();
      },
      resetPassword: async (
        password: string,
        confirmPassword: string,
        confirmationToken: string,
      ) => {
        const { errors, data } = await this.props.resetPassword({
          variables: {
            input: { password, confirmPassword, confirmationToken },
          },
        });
        if (errors) {
          return errorOrSuccess(this.props.alert, parseError(errors));
        }
        return data.resetPassword;
      },
      resetPasswordRequest: async (email: string) => {
        const { errors, data } = await this.props.resetPasswordRequest({
          variables: { input: { email } },
        });
        if (errors) {
          return errorOrSuccess(this.props.alert, parseError(errors));
        }
        return data.sendPasswordResetEmail.status;
      },
      signin: async (user: IUser) => {
        try {
          const { errors, data } = await this.props.signin({
            variables: { input: user },
          });
          if (errors) {
            // errorOrSuccess(this.props.alert, parseError(errors), [], false);
            return parseError(errors)[0];
          } else if (data.signin && data.signin.token) {
            localStorage.setItem('token', data.signin.token);
            this.setState({
              auth: { ...this.state.auth, token: data.signin.token },
            });
            history.push('/');
          }
        } catch (e) {
          // errorOrSuccess(this.props.alert, parseError(e));
          return parseError(e)[0];
        }
      },
      signout: async () => {
        try {
          await this.props.signout({
            update: (cache: any, { data }: any) => {
              this.setState({ auth: { ...this.state.auth, token: null } });
              localStorage.removeItem('token');
              this.props.client.resetStore();
            },
          });
          history.push('/login');
          return true;
        } catch (e) {
          localStorage.removeItem('token');
          this.props.client.resetStore();
          history.push('/login');
          return false;
        }
      },
      signup: async (user: IUser) => {
        try {
          const { errors, data } = await this.props.signup({
            variables: { input: user },
          });

          if (errors) {
            errorOrSuccess(this.props.alert, parseError(errors));
            return false;
          } else {
            errorOrSuccess(
              this.props.alert,
              [],
              ['signup.form.check_your_email'],
            );
            history.push('/signup-success');
          }
          return true;
        } catch (e) {
          errorOrSuccess(this.props.alert, parseError(e));
          return false;
        }
      },
      token: localStorage.getItem('token'),
    },
  };

  render() {
    const { auth } = this.state;

    return (
      <Provider
        value={{
          auth: {
            ...auth,
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
  injectIntl,
  withRouter,
  Alert.hoc(),
  graphql(activateUser, { name: 'activateUser' }),
  graphql(refreshConfirmationTokenUser, {
    name: 'refreshConfirmationTokenUser',
  }),
  graphql(resetPasswordRequest, { name: 'resetPasswordRequest' }),
  graphql(resetPassword, { name: 'resetPassword' }),
  graphql(signin, { name: 'signin' }),
  graphql(signup, { name: 'signup' }),
  graphql(signout, { name: 'signout' }),
)(AuthProvider as any);
