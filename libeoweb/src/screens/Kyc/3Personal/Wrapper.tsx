import { KycRoute } from 'components/Route';
import * as Beneficiaries from 'context/Beneficiaries';
import * as User from 'context/User';
import * as React from 'react';
import { RouteComponentProps, withRouter } from 'react-router';
import { Provider } from '../FormBeneficiary/context/index';

const Who = React.lazy(() => import('./Who'));
const Form1 = React.lazy(() => import('../FormBeneficiary/Form1'));
const Form2 = React.lazy(() => import('../FormBeneficiary/Form2'));
const Form3 = React.lazy(() => import('../FormBeneficiary/Form3'));
const Form4 = React.lazy(() => import('../FormBeneficiary/Form4'));

interface IProps extends User.InjectedProps, RouteComponentProps {}
interface IState {}

class Wrapper extends React.PureComponent<IProps, IState> {
  render() {
    // const { location, user } = this.props;
    // const me = user &&
    //   user.data &&
    //   user.data.me;

    // const currentCompany:any = me.currentCompany;
    // const kycStep:string = currentCompany.kycStep;

    return (
      <Beneficiaries.Provider representatives beneficiaries>
        <Provider
          isCurrent
          baseUrl="/kyc/personal-information"
          nextUrl="/kyc/beneficiary"
          currentStep="PERSONNAL_INFORMATION"
          nextStep="BENEFICIARIES"
        >
          <KycRoute exact path="/kyc/personal-information" component={Who} />
          <KycRoute path="/kyc/personal-information/part-1" component={Form1} />
          <KycRoute path="/kyc/personal-information/part-2" component={Form2} />
          <KycRoute path="/kyc/personal-information/part-3" component={Form3} />
          <KycRoute path="/kyc/personal-information/part-4" component={Form4} />
        </Provider>
      </Beneficiaries.Provider>
    );
  }
}

export default User.hoc()(withRouter(Wrapper));
