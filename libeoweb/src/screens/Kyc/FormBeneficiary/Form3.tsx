import { Form } from 'antd';
import { Heading } from 'components/Typo';
import * as Beneficiaries from 'context/Beneficiaries';
import { IBeneficiaryInput } from 'context/Beneficiaries/types';
import * as Company from 'context/Company';
import * as React from 'react';
import { compose } from 'react-apollo';
import { injectIntl } from 'react-intl';
import * as KycCtx from '../context';
import Manager, { IManagerProps, IManagerState } from '../Manager';
import ComplementaryForm from './ComplementaryForm';
import * as TempBeneficiary from './context/index';

interface IProps
  extends IManagerProps,
    Beneficiaries.InjectedProps,
    TempBeneficiary.InjectedProps {}
interface IState extends IManagerState {}

class Form3 extends Manager<IProps, IState> {
  static defaultProps = {};

  handleSubmit: (next: boolean, beneficiary: IBeneficiaryInput) => void;

  constructor(props: any) {
    super(props);
    this.handleSubmit = this.submit.bind(this);
  }

  async later() {
    return false;
  }

  async submit(next: boolean, beneficiary: IBeneficiaryInput) {
    if (!next) {
      super.later();
    }
    const { saveBeneficiary } = this.props;
    if (saveBeneficiary) {
      await saveBeneficiary(beneficiary);
    }
    if (next) {
      this.save();
    }
  }

  componentWillUnmount() {}

  componentDidMount() {
    const { currentStep, nextUrl, kycSetState, nextStep } = this.props;
    // super.componentDidMount();

    kycSetState &&
      kycSetState({
        bottomBar: true,
        btn: 'kyc.bottom.confirm',
        btnLater: 'kyc.bottom.later',
        btnLaterLink: '/',
        btnLink: nextUrl,
        nextStep,
        step: `${currentStep}_PART_3`,
      });
  }

  render() {
    const { tempBeneficiary, location, values } = this.props;

    const keyTrad = location.pathname
      .replace(/\//g, '.')
      .replace(/-/g, '_')
      .substr(1);

    return super._render(
      <div className="kyc-personal-info-3">
        <div>
          <Heading
            titleVariables={{
              firstname: values.firstname || '',
              lastname: values.lastname || '',
            }}
            title={`${keyTrad}_title`}
            description={`${keyTrad}_description`}
          />
        </div>
        <ComplementaryForm
          onSave={this.handleSubmit}
          onLater={this.handleSubmit}
          beneficiary={tempBeneficiary}
        />
      </div>,
    );
  }
}

export default compose(
  Beneficiaries.hoc(),
  Form.create({}),
  TempBeneficiary.hoc(),
  Company.hoc(),
  KycCtx.hoc(),
  injectIntl,
)(Form3);
