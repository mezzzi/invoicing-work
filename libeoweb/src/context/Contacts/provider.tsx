import { ApolloClient } from 'apollo-client';
import * as Alert from 'context/Alert';
import * as User from 'context/User';
import * as React from 'react';
import { compose, graphql, withApollo } from 'react-apollo';
import { errorOrSuccess, parseError } from 'utils';
import { IContactsContextInterface, Provider } from './context';
import { createContact, updateContact } from './queries';
import { IInputContact } from './types';

interface IState extends IContactsContextInterface {}

interface IProps extends Alert.InjectedProps, User.InjectedProps {
  createContact: any;
  updateContact: any;
  children: React.ReactNode;
  client: ApolloClient<any>;
}

class ContactsContextProvider extends React.PureComponent<IProps, IState> {
  state = {
    contact: {
      create: async (inputContact: IInputContact) => {
        try {
          const { data } = await this.props.createContact({
            variables: { input: inputContact },
          });
          errorOrSuccess(
            this.props.alert,
            [],
            ['partners.contact.success_add'],
          );
          return data.createContact;
        } catch (e) {
          errorOrSuccess(this.props.alert, parseError(e));
        }
      },
      update: async (id: string, inputContact: IInputContact) => {
        try {
          const results = await this.props.updateContact({
            variables: { id, input: inputContact },
          });
          errorOrSuccess(
            this.props.alert,
            [],
            ['partners.contact.success_update'],
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
          contact: {
            ...this.state.contact,
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
  graphql(createContact, { name: 'createContact' }),
  graphql(updateContact, { name: 'updateContact' }),
)(ContactsContextProvider);
