import * as React from 'react';
import { wrapDisplayName } from 'recompose';
import { Consumer, IEditAddressesContext } from './context';

const withEditAddressesHoc = () => <P extends object>(
  // Component: React.ComponentType<P & IEditAddressesContext>
  Component: React.ComponentType<P>,
) => {
  type ResultProps = P & Partial<IEditAddressesContext>;

  class WithEditAddressesHoc extends React.Component<ResultProps> {
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
    (WithEditAddressesHoc as any).displayName = wrapDisplayName(
      Component,
      'withEditAddressesHoc',
    );
  }

  return WithEditAddressesHoc;
};

export default withEditAddressesHoc;
