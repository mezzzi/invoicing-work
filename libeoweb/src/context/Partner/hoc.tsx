import * as React from 'react';
import { wrapDisplayName } from 'recompose';
import { Consumer, IPartnerContextInterface } from './context';

const withPartner = () => <OriginalProps extends {}>(
  Component: React.ComponentType<OriginalProps & IPartnerContextInterface>,
) => {
  type ResultProps = OriginalProps & IPartnerContextInterface;

  class WithPartner extends React.Component<ResultProps> {
    render() {
      return (
        <Consumer>{props => <Component {...this.props} {...props} />}</Consumer>
      );
    }
  }

  if (process.env.NODE_ENV !== 'production') {
    (WithPartner as any).displayName = wrapDisplayName(
      Component,
      'withPartner',
    );
  }

  return WithPartner;
};

export default withPartner;
