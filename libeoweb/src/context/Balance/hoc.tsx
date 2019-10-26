import * as React from 'react';
import { wrapDisplayName } from 'recompose';
import { Consumer, IBalanceContextInterface } from './context';

const withBalance = () => <OriginalProps extends {}>(
  Component: React.ComponentType<OriginalProps & IBalanceContextInterface>,
) => {
  type ResultProps = OriginalProps & IBalanceContextInterface;

  class WithBalance extends React.Component<ResultProps> {
    render() {
      return (
        <Consumer>{props => <Component {...this.props} {...props} />}</Consumer>
      );
    }
  }

  if (process.env.NODE_ENV !== 'production') {
    (WithBalance as any).displayName = wrapDisplayName(
      Component,
      'withBalance',
    );
  }

  return WithBalance;
};

export default withBalance;
