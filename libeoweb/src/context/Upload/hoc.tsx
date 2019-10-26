import * as React from 'react';
import { wrapDisplayName } from 'recompose';
import { Consumer, IUploadContextInterface } from './context';

const withUpload = () => <OriginalProps extends {}>(
  Component: React.ComponentType<OriginalProps & IUploadContextInterface>,
) => {
  type ResultProps = OriginalProps & IUploadContextInterface;

  class WithUpload extends React.Component<ResultProps> {
    render() {
      return (
        <Consumer>{props => <Component {...this.props} {...props} />}</Consumer>
      );
    }
  }

  if (process.env.NODE_ENV !== 'production') {
    (WithUpload as any).displayName = wrapDisplayName(Component, 'withUpload');
  }

  return WithUpload;
};

export default withUpload;
