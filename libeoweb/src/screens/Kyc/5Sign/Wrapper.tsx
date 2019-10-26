import { KycRoute } from 'components/Route';
import * as React from 'react';

const Sign = React.lazy(() => import('./Sign'));

interface IProps {}
interface IState {}

class Wrapper extends React.PureComponent<IProps, IState> {
  render() {
    return <KycRoute path="/kyc/sign" component={Sign} />;
  }
}

export default Wrapper;
