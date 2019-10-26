import * as React from 'react';
import { wrapDisplayName } from 'recompose';
import { Consumer, ISirenContextInterface } from './context';

const withSiren = () => <OriginalProps extends {}>(
  Component: React.ComponentType<OriginalProps & ISirenContextInterface>,
) => {
  type ResultProps = OriginalProps & ISirenContextInterface;

  class WithSiren extends React.Component<ResultProps> {
    render() {
      return (
        <Consumer>{props => <Component {...this.props} {...props} />}</Consumer>
      );
    }
  }

  if (process.env.NODE_ENV !== 'production') {
    (WithSiren as any).displayName = wrapDisplayName(Component, 'withSiren');
  }

  return WithSiren;
};

export default withSiren;
