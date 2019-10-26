import * as React from 'react';
import { wrapDisplayName } from 'recompose';
import { Consumer, ITempCompanyContext } from './context';

const withTempCompanyHoc = () => <OriginalProps extends {}>(
  Component: React.ComponentType<OriginalProps & ITempCompanyContext>,
) => {
  type ResultProps = OriginalProps & ITempCompanyContext;

  class WithTempCompanyHoc extends React.Component<ResultProps> {
    render() {
      return (
        <Consumer>{props => <Component {...this.props} {...props} />}</Consumer>
      );
    }
  }

  if (process.env.NODE_ENV !== 'production') {
    (WithTempCompanyHoc as any).displayName = wrapDisplayName(
      Component,
      'withTempCompanyHoc',
    );
  }

  return WithTempCompanyHoc;
};

export default withTempCompanyHoc;
