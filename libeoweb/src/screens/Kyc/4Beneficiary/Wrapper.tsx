import { KycRoute } from 'components/Route';
import * as Beneficiaries from 'context/Beneficiaries';
import * as React from 'react';
import { Provider } from '../FormBeneficiary/context/index';

const List = React.lazy(() => import('./List'));
const Form1 = React.lazy(() => import('../FormBeneficiary/Form1'));
const Form2 = React.lazy(() => import('../FormBeneficiary/Form2'));
const Form3 = React.lazy(() => import('../FormBeneficiary/Form3'));
const Form4 = React.lazy(() => import('../FormBeneficiary/Form4'));

interface IProps {}
interface IState {}

class Wrapper extends React.PureComponent<IProps, IState> {
  render() {
    return (
      <Beneficiaries.Provider representatives beneficiaries>
        <Provider
          baseUrl="/kyc/beneficiary"
          nextUrl="/kyc/beneficiary"
          currentStep="BENEFICIARIES"
          nextStep="BENEFICIARIES"
        >
          <KycRoute exact path="/kyc/beneficiary" component={List} />
          <KycRoute path="/kyc/beneficiary/part-1" component={Form1} />
          <KycRoute path="/kyc/beneficiary/part-2" component={Form2} />
          <KycRoute path="/kyc/beneficiary/part-3" component={Form3} />
          <KycRoute path="/kyc/beneficiary/part-4" component={Form4} />
        </Provider>
      </Beneficiaries.Provider>
    );
  }
}

export default Wrapper;
