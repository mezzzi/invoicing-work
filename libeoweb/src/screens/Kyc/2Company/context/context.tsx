import { IInputCompany } from 'context/Company/types.d';
import * as React from 'react';

export interface ITempCompanyContext {
  tempCompany?: IInputCompany;
  updateTempCompany: (company?: IInputCompany) => void;
}

const Context = React.createContext<ITempCompanyContext>({
  tempCompany: undefined,
  updateTempCompany: () => {},
});

const Consumer = Context.Consumer;

interface IProps {
  children: React.ReactNode;
}
interface IState extends ITempCompanyContext {}

class Provider extends React.PureComponent<IProps, IState> {
  state = {
    tempCompany: undefined,
    updateTempCompany: (tempCompany?: IInputCompany) => {
      this.setState({ tempCompany });
    },
  };

  render() {
    return (
      <Context.Provider value={this.state}>
        {this.props.children}
      </Context.Provider>
    );
  }
}

export { Provider, Consumer };
