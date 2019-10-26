import * as React from 'react';
import { wrapDisplayName } from 'recompose';
import { Consumer, IIbanContextInterface } from './context';

const withIban = () => <OriginalProps extends {}>(
  Component: React.ComponentType<OriginalProps & IIbanContextInterface>,
) => {
  type ResultProps = OriginalProps & IIbanContextInterface;

  class WithIban extends React.Component<ResultProps> {
    render() {
      return (
        <Consumer>{props => <Component {...this.props} {...props} />}</Consumer>
      );
    }
  }

  if (process.env.NODE_ENV !== 'production') {
    (WithIban as any).displayName = wrapDisplayName(Component, 'withIban');
  }

  return WithIban;
};

export default withIban;
