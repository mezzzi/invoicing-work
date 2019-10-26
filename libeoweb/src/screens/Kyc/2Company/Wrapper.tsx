import { KycRoute } from 'components/Route';
import * as Siren from 'context/Siren';
import * as React from 'react';
import { RouteComponentProps, withRouter } from 'react-router';
import { Provider } from './context/index';

const Form1 = React.lazy(() => import('./Form1'));
const Form2 = React.lazy(() => import('./Form2'));

interface IProps extends RouteComponentProps {}
interface IState {}

class Wrapper extends React.PureComponent<IProps, IState> {
  render() {
    return (
      <Siren.Provider>
        <Provider>
          <KycRoute exact path="/kyc/company" component={Form1} />
          <KycRoute path="/kyc/company/address" component={Form2} />
        </Provider>
      </Siren.Provider>
    );
  }
}

export default withRouter(Wrapper);
