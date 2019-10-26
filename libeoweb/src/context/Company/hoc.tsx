import * as React from 'react';
import { wrapDisplayName } from 'recompose';
import { Consumer, ICompanyContextInterface } from './context';

const withCompany = () => <OriginalProps extends {}>(
  Component: React.ComponentType<OriginalProps & ICompanyContextInterface>,
) => {
  type ResultProps = OriginalProps & ICompanyContextInterface;

  class WithCompany extends React.Component<ResultProps> {
    render() {
      return (
        <Consumer>{props => <Component {...this.props} {...props} />}</Consumer>
      );
    }
  }

  if (process.env.NODE_ENV !== 'production') {
    (WithCompany as any).displayName = wrapDisplayName(
      Component,
      'withCompany',
    );
  }

  return WithCompany;
};

export default withCompany;
