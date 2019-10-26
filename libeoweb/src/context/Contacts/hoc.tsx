import * as React from 'react';
import { wrapDisplayName } from 'recompose';
import { Consumer, IContactsContextInterface } from './context';

const withContacts = () => <OriginalProps extends {}>(
  Component: React.ComponentType<OriginalProps & IContactsContextInterface>,
) => {
  type ResultProps = OriginalProps & IContactsContextInterface;

  class WithContacts extends React.Component<ResultProps> {
    render() {
      return (
        <Consumer>{props => <Component {...this.props} {...props} />}</Consumer>
      );
    }
  }

  if (process.env.NODE_ENV !== 'production') {
    (WithContacts as any).displayName = wrapDisplayName(
      Component,
      'withContacts',
    );
  }

  return WithContacts;
};

export default withContacts;
