import * as React from 'react';
import { wrapDisplayName } from 'recompose';
import { Consumer, ITempBeneficiaryContext } from './context';

const withTempBeneficiaryHoc = () => <OriginalProps extends {}>(
  Component: React.ComponentType<OriginalProps & ITempBeneficiaryContext>,
) => {
  type ResultProps = OriginalProps & ITempBeneficiaryContext;

  class WithTempBeneficiaryHoc extends React.Component<ResultProps> {
    render() {
      return (
        <Consumer>{props => <Component {...this.props} {...props} />}</Consumer>
      );
    }
  }

  if (process.env.NODE_ENV !== 'production') {
    (WithTempBeneficiaryHoc as any).displayName = wrapDisplayName(
      Component,
      'withTempBeneficiaryHoc',
    );
  }

  return WithTempBeneficiaryHoc;
};

export default withTempBeneficiaryHoc;
