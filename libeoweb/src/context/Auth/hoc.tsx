import * as React from 'react';
import { wrapDisplayName } from 'recompose';
import { Consumer, IAuthContextInterface } from './context';

const withAuth = () => <OriginalProps extends {}>(
  Component: React.ComponentType<OriginalProps & IAuthContextInterface>,
) => {
  type ResultProps = OriginalProps & IAuthContextInterface;

  class WithAuth extends React.Component<ResultProps> {
    render() {
      return (
        <Consumer>{props => <Component {...this.props} {...props} />}</Consumer>
      );
    }
  }

  if (process.env.NODE_ENV !== 'production') {
    (WithAuth as any).displayName = wrapDisplayName(Component, 'withAuth');
  }

  return WithAuth;
};

export default withAuth;
