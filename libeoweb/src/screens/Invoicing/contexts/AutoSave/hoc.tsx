import { IAutoSaveInterface } from 'components/Invoicing/types';
import * as React from 'react';
import { wrapDisplayName } from 'recompose';
import { Consumer } from 'screens/Invoicing/contexts/AutoSave/context';

const withAutoSave = () => (Component: any) => {
  class WithAutoSave extends React.PureComponent<any, any> {
    render() {
      return (
        <Consumer>{props => <Component {...this.props} {...props} />}</Consumer>
      );
    }
  }

  if (process.env.NODE_ENV !== 'production') {
    (WithAutoSave as any).displayName = wrapDisplayName(
      Component,
      'WithAutoSave',
    );
  }

  return WithAutoSave;
};

export default withAutoSave;
