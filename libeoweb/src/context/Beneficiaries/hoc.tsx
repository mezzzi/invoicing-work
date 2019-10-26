import * as React from 'react';
import { wrapDisplayName } from 'recompose';
import { Consumer, IBeneficiariesContextInterface } from './context';

const withBeneficiaries = () => <OriginalProps extends {}>(
  Component: React.ComponentType<
    OriginalProps & IBeneficiariesContextInterface
  >,
) => {
  type ResultProps = OriginalProps & IBeneficiariesContextInterface;

  class WithBeneficiaries extends React.Component<ResultProps> {
    render() {
      return (
        <Consumer>{props => <Component {...this.props} {...props} />}</Consumer>
      );
    }
  }

  if (process.env.NODE_ENV !== 'production') {
    (WithBeneficiaries as any).displayName = wrapDisplayName(
      Component,
      'withBeneficiaries',
    );
  }

  return WithBeneficiaries;
};

export default withBeneficiaries;
