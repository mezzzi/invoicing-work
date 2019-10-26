import * as React from 'react';
import { wrapDisplayName } from 'recompose';
import { Consumer, IInvoicesContextInterface } from './context';

const withInvoice = () => <OriginalProps extends {}>(
  Component: React.ComponentType<OriginalProps & IInvoicesContextInterface>,
) => {
  type ResultProps = OriginalProps & IInvoicesContextInterface;

  class WithInvoice extends React.Component<ResultProps> {
    render() {
      return (
        <Consumer>{props => <Component {...this.props} {...props} />}</Consumer>
      );
    }
  }

  if (process.env.NODE_ENV !== 'production') {
    (WithInvoice as any).displayName = wrapDisplayName(
      Component,
      'withInvoice',
    );
  }

  return WithInvoice;
};

export default withInvoice;
