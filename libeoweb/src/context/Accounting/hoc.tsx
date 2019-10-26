import * as React from 'react';
import { wrapDisplayName } from 'recompose';
import { Consumer, IAccountingContextInterface } from './context';

const withAccounting = () => <OriginalProps extends {}>(
  Component: React.ComponentType<OriginalProps & IAccountingContextInterface>,
) => {
  type ResultProps = OriginalProps & IAccountingContextInterface;

  class WithAccounting extends React.Component<ResultProps> {
    render() {
      return (
        <Consumer>{props => <Component {...this.props} {...props} />}</Consumer>
      );
    }
  }

  if (process.env.NODE_ENV !== 'production') {
    (WithAccounting as any).displayName = wrapDisplayName(
      Component,
      'withAccounting',
    );
  }

  return WithAccounting;
};

export default withAccounting;
