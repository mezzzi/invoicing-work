import * as React from 'react';
import { wrapDisplayName } from 'recompose';
import { Consumer, ITransactionsContextInterface } from './context';

const withTransactions = () => <OriginalProps extends {}>(
  Component: React.ComponentType<OriginalProps & ITransactionsContextInterface>,
) => {
  type ResultProps = OriginalProps & ITransactionsContextInterface;

  class WithTransactions extends React.Component<ResultProps> {
    render() {
      return (
        <Consumer>{props => <Component {...this.props} {...props} />}</Consumer>
      );
    }
  }

  if (process.env.NODE_ENV !== 'production') {
    (WithTransactions as any).displayName = wrapDisplayName(
      Component,
      'withTransactions',
    );
  }

  return WithTransactions;
};

export default withTransactions;
