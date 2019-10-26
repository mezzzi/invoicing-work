import * as React from 'react';
import { wrapDisplayName } from 'recompose';
import { Consumer, IKycContext } from './context';

const withKycHoc = () => <P extends object>(
  // Component: React.ComponentType<P & IKycContext>
  Component: React.ComponentType<P>,
) => {
  type ResultProps = P & Partial<IKycContext>;

  class WithKycHoc extends React.Component<ResultProps> {
    render() {
      return (
        <Consumer>
          {props => {
            return <Component {...this.props} {...props} />;
          }}
        </Consumer>
      );
    }
  }

  if (process.env.NODE_ENV !== 'production') {
    (WithKycHoc as any).displayName = wrapDisplayName(Component, 'withKycHoc');
  }

  return WithKycHoc;
};

export default withKycHoc;
