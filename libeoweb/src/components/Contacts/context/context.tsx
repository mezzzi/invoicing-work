import * as Contacts from 'context/Contacts';
import { IContact } from 'context/Contacts/types.d';
import * as React from 'react';

export interface IEditContactContext {
  editContact?: {
    done: () => void;
    edit: (contacts?: IContact) => void;
    editing: boolean;
    selectedContact?: IContact;
  };
}

const Context = React.createContext<IEditContactContext>({
  editContact: {
    done: () => {},
    edit: () => {},
    editing: false,
    selectedContact: undefined,
  },
});

const Consumer = Context.Consumer;

interface IProps {}

interface IState extends IEditContactContext {}

class Provider extends React.PureComponent<IProps, IState> {
  state = {
    editContact: {
      done: () => {
        this.setState({
          editContact: {
            ...this.state.editContact,
            editing: false,
            selectedContact: undefined,
          },
        });
      },
      edit: (address?: IContact) => {
        this.setState({
          editContact: {
            ...this.state.editContact,
            editing: true,
            selectedContact: address,
          },
        });
      },
      editing: false,
      selectedContact: undefined,
    },
  };

  constructor(props: any) {
    super(props);
  }

  render() {
    return (
      <Contacts.Provider>
        <Context.Provider value={this.state}>
          {this.props.children}
        </Context.Provider>
      </Contacts.Provider>
    );
  }
}

const composedProvider = Provider;

export { composedProvider as Provider, Consumer };
