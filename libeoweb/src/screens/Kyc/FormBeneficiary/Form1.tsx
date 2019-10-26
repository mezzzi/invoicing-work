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
import CommonForm from './CommonForm';
import * as TempBeneficiary from './context/index';

interface IProps
  extends IManagerProps,
    Beneficiaries.InjectedProps,
    TempBeneficiary.InjectedProps {}
interface IState extends IManagerState {}

class Form1 extends Manager<IProps, IState> {
  static defaultProps = {};

  state = {
    btnDisabled: false,
    btnLoading: false,
  };

  handleSubmit: (next: boolean, beneficiary: IBeneficiaryInput) => void;
  handleRemoveDocument: (documentId: number) => void;
  constructor(props: any) {
    super(props);
    this.handleSubmit = this.submit.bind(this);
    this.handleRemoveDocument = this.removeDocument.bind(this);
  }

  removeDocument(documentId: number) {
    const { removeDocument } = this.props;
    removeDocument && removeDocument(documentId);
  }

  async later() {
    return false;
  }

  async submit(next: boolean, beneficiary?: IBeneficiaryInput) {
    if (!next) {
      super.later();
    }
    const { saveBeneficiary, tempBeneficiary, kycSetState } = this.props;

    if (saveBeneficiary && beneficiary) {
      await saveBeneficiary(beneficiary);
    }
    if (next) {
      this.save();
    }
  }

  componentWillUnmount() {}

  componentDidMount() {
    const { currentStep, nextStep, baseUrl, kycSetState } = this.props;
    // super.componentDidMount();

    kycSetState &&
      kycSetState({
        bottomBar: true,
        btn: 'kyc.bottom.confirm',
        btnLater: 'kyc.bottom.later',
        btnLaterLink: '/',
        btnLink: `${baseUrl}/part-2`,
        nextStep: `${currentStep}_PART_2`,
        step: `${currentStep}_PART_1`,
      });
  }

  render() {
    const {
      tempBeneficiary,
      values,
      location,
      isCurrent,
      baseUrl,
    } = this.props;

    const keyTrad = location.pathname
      .replace(/\//g, '.')
      .replace(/-/g, '_')
      .substr(1);

    return super._render(
      <div className="kyc-personal-info-1">
        <div>
          <Heading
            titleVariables={{
              firstname: values.firstname || '',
              lastname: values.lastname || '',
            }}
            title={
              values.firstname || values.lastname
                ? `${keyTrad}_title`
                : `${keyTrad}_title_empty`
            }
            description={`${keyTrad}_description`}
          />
        </div>
        <CommonForm
          isCurrent={isCurrent}
          onSave={this.handleSubmit}
          onRemoveDocument={this.handleRemoveDocument}
          beneficiary={tempBeneficiary}
        />
      </div>,
    );
  }
}

export default compose(
  Beneficiaries.hoc(),
  Form.create({}),
  Company.hoc(),
  KycCtx.hoc(),
  TempBeneficiary.hoc(),
  injectIntl,
)(Form1);
