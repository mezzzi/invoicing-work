import * as React from 'react';
import { wrapDisplayName } from 'recompose';
import { Consumer, IEditContactContext } from './context';

const withEditContactHoc = () => <P extends object>(
  // Component: React.ComponentType<P & IEditContactContext>
  Component: React.ComponentType<P>,
) => {
  type ResultProps = P & Partial<IEditContactContext>;

  class WithEditContactHoc extends React.Component<ResultProps> {
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
    (WithEditContactHoc as any).displayName = wrapDisplayName(
      Component,
      'withEditContactHoc',
    );
  }

  return WithEditContactHoc;
};

export default withEditContactHoc;
