import * as React from 'react';
import { wrapDisplayName } from 'recompose';
import { Consumer, IPartnersContextInterface } from './context';

const withPartners = () => <OriginalProps extends {}>(
  Component: React.ComponentType<OriginalProps & IPartnersContextInterface>,
) => {
  type ResultProps = OriginalProps & IPartnersContextInterface;

  class WithPartners extends React.Component<ResultProps> {
    render() {
      return (
        <Consumer>{props => <Component {...this.props} {...props} />}</Consumer>
      );
    }
  }

  if (process.env.NODE_ENV !== 'production') {
    (WithPartners as any).displayName = wrapDisplayName(
      Component,
      'withPartners',
    );
  }

  return WithPartners;
};

export default withPartners;
