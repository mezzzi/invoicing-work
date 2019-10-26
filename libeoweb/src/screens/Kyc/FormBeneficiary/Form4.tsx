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
import * as TempBeneficiary from './context/index';
import PowerForm from './PowerForm';

interface IProps
  extends IManagerProps,
    Beneficiaries.InjectedProps,
    TempBeneficiary.InjectedProps {}
interface IState extends IManagerState {}

class Form4 extends Manager<IProps, IState> {
  static defaultProps = {};

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

  async submit(next: boolean, beneficiary: IBeneficiaryInput) {
    const { saveBeneficiary } = this.props;
    if (!next) {
      super.later();
    }

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
        step: `${currentStep}_PART_4`,
      });
  }

  render() {
    const { tempBeneficiary, location, baseUrl, values } = this.props;

    // if (!tempBeneficiary) {
    //   return (
    //     <Redirect
    //       to={{
    //         pathname: baseUrl,
    //         state: { from: location }
    //       }}
    //     />
    //   );
    // }

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
        <PowerForm
          onRemoveDocument={this.handleRemoveDocument}
          onSave={this.handleSubmit}
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
)(Form4);
