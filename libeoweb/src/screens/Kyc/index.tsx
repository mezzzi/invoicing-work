import { KycRoute } from 'components/Route';
import * as User from 'context/User';
import * as React from 'react';
import { Redirect, RouteComponentProps, withRouter } from 'react-router';
import * as KycCtx from './context';
import './Kyc.module.less';
import KycWrapper from './KycWrapper';

const Intro = React.lazy(() => import('./1Intro/index'));
const Company = React.lazy(() => import('./2Company/index'));
const Personal = React.lazy(() => import('./3Personal/index'));
const Beneficiary = React.lazy(() => import('./4Beneficiary/index'));
const Sign = React.lazy(() => import('./5Sign/index'));
const Iban = React.lazy(() => import('./6Iban/index'));

interface IProps extends User.InjectedProps, RouteComponentProps {}
interface IState {}

class Kyc extends React.PureComponent<IProps, IState> {
  render() {
    const { location, user } = this.props;
    const me = user && user.data && user.data.me;

    if (!me) {
      return <></>;
    }

    const currentCompany: any = me.currentCompany;
    const pathname: string = location.pathname;

    const pathnames: string[] = [
      '/kyc',
      '/kyc/company',
      '/kyc/company/address',
      '/kyc/personal-information',
      '/kyc/personal-information/part-1',
      '/kyc/personal-information/part-2',
      '/kyc/personal-information/part-3',
      '/kyc/personal-information/part-4',
      '/kyc/beneficiary',
      '/kyc/beneficiary/part-1',
      '/kyc/beneficiary/part-2',
      '/kyc/beneficiary/part-3',
      '/kyc/beneficiary/part-4',
      '/kyc/sign',
      '/kyc/iban',
    ];

    const pathIndex: number = pathnames.indexOf(pathname);
    const kycStep: string = currentCompany && currentCompany.kycStep;

    if (pathIndex === -1) {
      return <Redirect to={{ pathname: '/kyc' }} />;
    }
    if (!currentCompany) {
      if (pathIndex > 2) {
        return <Redirect to={{ pathname: '/kyc' }} />;
      }
    } else if (kycStep) {
      if (
        kycStep.indexOf('PERSONNAL_INFORMATION_PART_4') > -1 &&
        pathIndex !== 7
      ) {
        return (
          <Redirect to={{ pathname: '/kyc/personal-information/part-4' }} />
        );
      }
      if (
        kycStep.indexOf('PERSONNAL_INFORMATION_PART_3') > -1 &&
        pathIndex !== 6
      ) {
        return (
          <Redirect to={{ pathname: '/kyc/personal-information/part-3' }} />
        );
      }
      if (
        kycStep.indexOf('PERSONNAL_INFORMATION_PART_2') > -1 &&
        pathIndex !== 5
      ) {
        return (
          <Redirect to={{ pathname: '/kyc/personal-information/part-2' }} />
        );
      }
      if (
        kycStep.indexOf('PERSONNAL_INFORMATION') > -1 &&
        (pathIndex > 7 || pathIndex < 3)
      ) {
        return <Redirect to={{ pathname: '/kyc/personal-information' }} />;
      }
      if (
        kycStep.indexOf('BENEFICIARIES') > -1 &&
        (pathIndex > 12 || pathIndex < 8)
      ) {
        return <Redirect to={{ pathname: '/kyc/beneficiary' }} />;
      }
      if (kycStep.indexOf('SIGN') > -1 && (pathIndex > 13 || pathIndex < 13)) {
        return <Redirect to={{ pathname: '/kyc/sign' }} />;
      }
      if (kycStep.indexOf('IBAN') > -1 && pathIndex < 14) {
        return <Redirect to={{ pathname: '/kyc/iban' }} />;
      }
    }

    return (
      <KycCtx.Provider>
        <KycWrapper>
          <KycRoute exact path="/kyc" component={Intro} />
          <KycRoute path="/kyc/company/:view?" component={Company} />
          <KycRoute
            path="/kyc/personal-information/:view?"
            component={Personal}
          />
          <KycRoute path="/kyc/beneficiary/:view?" component={Beneficiary} />
          <KycRoute path="/kyc/sign" component={Sign} />
          <KycRoute path="/kyc/iban" component={Iban} />
        </KycWrapper>
      </KycCtx.Provider>
    );
  }
}

export default User.hoc()(withRouter(Kyc));
