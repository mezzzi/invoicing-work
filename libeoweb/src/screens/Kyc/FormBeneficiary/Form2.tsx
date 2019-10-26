import { Form } from 'antd';
import { UploadFile } from 'antd/lib/upload/interface';
import { Heading } from 'components/Typo';
import * as Beneficiaries from 'context/Beneficiaries';
import { IBeneficiaryInput } from 'context/Beneficiaries/types';
import * as Company from 'context/Company';
import * as React from 'react';
import { compose } from 'react-apollo';
import { injectIntl } from 'react-intl';
import * as KycCtx from '../context';
import Manager, { IManagerProps, IManagerState } from '../Manager';
import AddressForm from './AddressForm';
import * as TempBeneficiary from './context/index';

interface IProps
  extends IManagerProps,
    Beneficiaries.InjectedProps,
    TempBeneficiary.InjectedProps {}
interface IState extends IManagerState {}

class Form2 extends Manager<IProps, IState> {
  static defaultProps = {};

  state = {
    btnDisabled: false,
  };

  handleSubmit: (next: boolean, beneficiary: IBeneficiaryInput) => void;
  handleRemoveDocument: (documentId: number) => void;
  handleProofChange: (file?: UploadFile) => void;

  constructor(props: any) {
    super(props);
    this.handleProofChange = this.proofChange.bind(this);
    this.handleSubmit = this.submit.bind(this);
    this.handleRemoveDocument = this.removeDocument.bind(this);
  }

  removeDocument(documentId: number) {
    const { removeDocument } = this.props;
    removeDocument && removeDocument(documentId);
  }

  proofChange(file?: UploadFile) {
    this.setState({
      proof: file,
      proofError: !file,
    });
  }

  async later() {
    return false;
  }

  async submit(next: boolean, beneficiary: IBeneficiaryInput) {
    if (!next) {
      super.later();
    }
    const {
      baseUrl,
      saveBeneficiary,
      tempBeneficiary,
      currentStep,
    } = this.props;

    if (saveBeneficiary) {
      await saveBeneficiary(beneficiary);
    }

    if (next) {
      this.save();
    }
  }

  componentWillUnmount() {}

  componentDidMount() {
    const {
      currentStep,
      nextStep,
      baseUrl,
      tempBeneficiary,
      kycSetState,
    } = this.props;
    // super.componentDidMount();

    let step = `${currentStep}_PART_3`;
    let btnLink = `${baseUrl}/part-3`;
    if (tempBeneficiary && tempBeneficiary.employeeType === 3) {
      step = `${currentStep}_PART_4`;
      btnLink = `${baseUrl}/part-4`;
    }

    kycSetState &&
      kycSetState({
        bottomBar: true,
        btn: 'kyc.bottom.confirm',
        btnLater: 'kyc.bottom.later',
        btnLaterLink: '/',
        btnLink,
        nextStep: step,
        step: `${currentStep}_PART_2`,
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
      <div className="kyc-personal-info-2">
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
        <AddressForm
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
  TempBeneficiary.hoc(),
  Company.hoc(),
  KycCtx.hoc(),
  injectIntl,
)(Form2);
