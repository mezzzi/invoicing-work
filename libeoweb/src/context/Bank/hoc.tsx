import * as React from 'react';
import { wrapDisplayName } from 'recompose';
import { Consumer, IBanksContextInterface } from './context';

const withBanks = () => <OriginalProps extends {}>(
  Component: React.ComponentType<OriginalProps & IBanksContextInterface>,
) => {
  type ResultProps = OriginalProps & IBanksContextInterface;

  class WithBanks extends React.Component<ResultProps> {
    render() {
      return (
        <Consumer>{props => <Component {...this.props} {...props} />}</Consumer>
      );
    }
  }

  if (process.env.NODE_ENV !== 'production') {
    (WithBanks as any).displayName = wrapDisplayName(Component, 'withBanks');
  }

  return WithBanks;
};

export default withBanks;
