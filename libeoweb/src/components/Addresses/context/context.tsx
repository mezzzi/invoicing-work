import * as Addresses from 'context/Addresses';
import { IAddress } from 'context/Addresses/types';
import * as React from 'react';

export interface IEditAddressesContext {
  editAddress?: {
    done: () => void;
    edit: (address?: IAddress) => void;
    editing: boolean;
    selectedAddress?: IAddress;
  };
}

const Context = React.createContext<IEditAddressesContext>({
  editAddress: {
    done: () => {},
    edit: () => {},
    editing: false,
    selectedAddress: undefined,
  },
});

const Consumer = Context.Consumer;

interface IProps {}

interface IState extends IEditAddressesContext {}

class Provider extends React.PureComponent<IProps, IState> {
  state = {
    editAddress: {
      done: () => {
        this.setState({
          editAddress: {
            ...this.state.editAddress,
            editing: false,
            selectedAddress: undefined,
          },
        });
      },
      edit: (address?: IAddress) => {
        this.setState({
          editAddress: {
            ...this.state.editAddress,
            editing: true,
            selectedAddress: address,
          },
        });
      },
      editing: false,
      selectedAddress: undefined,
    },
  };

  constructor(props: any) {
    super(props);
  }

  render() {
    return (
      <Addresses.Provider>
        <Context.Provider value={this.state}>
          {this.props.children}
        </Context.Provider>
      </Addresses.Provider>
    );
  }
}

const composedProvider = Provider;

export { composedProvider as Provider, Consumer };
