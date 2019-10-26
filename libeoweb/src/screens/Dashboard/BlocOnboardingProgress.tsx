import { Col, Row, Steps } from 'antd';
import { Icon } from 'components/Assets';
import { IconValue } from 'components/Assets/Icon';
import { Card } from 'components/Card';
import { ICompany, IKycStatus } from 'context/Company/types.d';
import * as User from 'context/User';
import { IUser } from 'context/User/types';
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';
const Step = Steps.Step;

interface IProps extends User.InjectedProps {}
interface IState {}

class BlocOnboardingProgress extends React.PureComponent<IProps, IState> {
  state = {};

  render() {
    const { user } = this.props;
    const me: IUser = user && user.data && user.data.me;
    const currentCompany: ICompany = me && me.currentCompany;

    let currentStep: number = -1;
    if (currentCompany && currentCompany.kycStep) {
      currentStep = 0;
      if (currentCompany.kycStep.indexOf('PERSONNAL_INFORMATION') > -1) {
        currentStep = 1;
      }
      if (currentCompany.kycStep.indexOf('BENEFICIARIES') > -1) {
        currentStep = 2;
      }
      if (currentCompany.kycStep.indexOf('SIGN') > -1) {
        currentStep = 3;
      }
      if (currentCompany.kycStep.indexOf('IBAN') > -1) {
        currentStep = 4;
      }
    }

    const customDot = (
      dot: any,
      { status, index }: { status: string; index: number },
    ) => {
      let icon;
      switch (status) {
        case 'finish':
          icon = (
            <div className={`dot-${status}`}>
              <Icon value={IconValue.Checkmark} />
            </div>
          );
          break;
        case 'process':
          if (index === 4) {
            const error: boolean =
              currentCompany.kycStatus === IKycStatus.REFUSED;
            icon = (
              <div className={`dot-${status}${error ? ' error' : ''}`}>
                <Icon value={error ? IconValue.Cross : IconValue.Alarm} />
              </div>
            );
          } else {
            icon = (
              <div className={`dot-${status}`}>
                <Icon value={IconValue.Alarm} />
              </div>
            );
          }
          break;
        default:
          icon = dot;
          break;
      }
      return icon;
    };

    return (
      <Card
        center
        style={{
          flexDirection: 'row',
        }}
        shadow
      >
        <Row
          type="flex"
          style={{
            alignItems: 'center',
            width: '100%',
          }}
        >
          <Col
            style={{
              flex: 1,
            }}
          >
            <Steps progressDot={customDot} current={currentStep}>
              <Step
                title={
                  <>
                    <Icon value={IconValue.Profile} />
                    <FormattedMessage id="dashboard.kyc.company" />
                  </>
                }
              />
              <Step
                title={
                  <>
                    <Icon value={IconValue.Briefcase} />
                    <FormattedMessage id="dashboard.kyc.informations" />
                  </>
                }
              />
              <Step
                title={
                  <>
                    <Icon value={IconValue.UserGroup} />
                    <FormattedMessage id="dashboard.kyc.beneficiary" />
                  </>
                }
              />
              <Step
                title={
                  <>
                    <Icon value={IconValue.Paper} />
                    <FormattedMessage id="dashboard.kyc.contract" />
                  </>
                }
              />
              <Step
                title={
                  <>
                    <Icon value={IconValue.Wallet} />
                    <FormattedMessage id="dashboard.kyc.iban" />
                  </>
                }
              />
            </Steps>
          </Col>
          {currentCompany && currentCompany.kycStatus === IKycStatus.PENDING && (
            <div className="ant-btn ant-btn-default">
              <Link to="/kyc-summary">
                <FormattedMessage id="dashboard.incomplete.btn_summary" />
              </Link>
            </div>
          )}
          {!currentCompany && (
            <div className="ant-btn ant-btn-default">
              <Link to="/kyc">
                <FormattedMessage id="dashboard.incomplete.btn_start" />
              </Link>
            </div>
          )}
          {currentCompany && !currentCompany.kycStatus && (
            <div className="ant-btn ant-btn-default">
              <Link to="/kyc">
                <FormattedMessage id="dashboard.incomplete.btn_complete" />
              </Link>
            </div>
          )}
        </Row>
      </Card>
    );
  }
}

export default User.hoc()(BlocOnboardingProgress);
