import * as React from 'react';
import { wrapDisplayName } from 'recompose';
import { Consumer, IUserContextInterface } from './context';

const withUser = () => <OriginalProps extends {}>(
  Component: React.ComponentType<OriginalProps & IUserContextInterface>,
) => {
  type ResultProps = OriginalProps & IUserContextInterface;

  class WithUser extends React.Component<ResultProps> {
    render() {
      return (
        <Consumer>{props => <Component {...this.props} {...props} />}</Consumer>
      );
    }
  }

  if (process.env.NODE_ENV !== 'production') {
    (WithUser as any).displayName = wrapDisplayName(Component, 'withUser');
  }

  return WithUser;
};

export default withUser;
