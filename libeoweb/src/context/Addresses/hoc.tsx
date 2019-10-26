import * as React from 'react';
import { wrapDisplayName } from 'recompose';
import { Consumer, IAddressesContextInterface } from './context';

const withAddresses = () => <OriginalProps extends {}>(
  Component: React.ComponentType<OriginalProps & IAddressesContextInterface>,
) => {
  type ResultProps = OriginalProps & IAddressesContextInterface;

  class WithAddresses extends React.Component<ResultProps> {
    render() {
      return (
        <Consumer>{props => <Component {...this.props} {...props} />}</Consumer>
      );
    }
  }

  if (process.env.NODE_ENV !== 'production') {
    (WithAddresses as any).displayName = wrapDisplayName(
      Component,
      'withAddresses',
    );
  }

  return WithAddresses;
};

export default withAddresses;
