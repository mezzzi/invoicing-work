import { Col, Form, Row } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import { UploadFile } from 'antd/lib/upload/interface';
import { Checkbox } from 'components/Form';
import { DocumentStatus, IBeneficiaryInput } from 'context/Beneficiaries/types';
import * as React from 'react';
import { compose } from 'react-apollo';
import { FormattedMessage, InjectedIntlProps, injectIntl } from 'react-intl';
import * as KycCtx from '../context';
import Proof from '../Proof';
import * as TempBeneficiary from './context/index';

interface IProps
  extends FormComponentProps,
    InjectedIntlProps,
    TempBeneficiary.InjectedProps,
    KycCtx.InjectedProps {
  className?: string;
  onSave?: (next: boolean, beneficiary: IBeneficiaryInput) => void;
  onRemoveDocument?: (documentId: number) => void;
  beneficiary?: IBeneficiaryInput;
}
interface IState {
  hasDocument: boolean;
  proofError: boolean;
  proof?: UploadFile;
  proofBase64?: string;
}

class PowerForm extends React.PureComponent<IProps, IState> {
  static getDerivedStateFromProps(props: IProps, state: IState) {
    let documentFound: boolean = false;
    const { beneficiary } = props;
    if (!state.proof) {
      if (
        beneficiary &&
        beneficiary.documents &&
        (beneficiary.documents as any).rows
      ) {
        (beneficiary.documents as any).rows.map((document: any) => {
          if (
            document.documentStatus !== DocumentStatus.CANCELED &&
            document.documentTypeId === 18
          ) {
            documentFound = true;
          }
        });
      }
    }
    return {
      hasDocument: documentFound,
    };
  }
  state = {
    btnDisabled: false,
    hasDocument: false,
    proof: undefined,
    proofError: false,
  };

  handleProofChange: (file?: UploadFile, base64?: string) => void;
  handleSubmit: () => void;
  handleLater: () => void;
  handleProofRemove: (uid: string) => void;
  handleProofCancel: (documentId: number) => void;
  handleBur: (node: any) => void;
  constructor(props: any) {
    super(props);
    this.handleProofChange = this.proofChange.bind(this);
    this.handleSubmit = this.submit.bind(this);
    this.handleLater = this.later.bind(this);
    this.handleProofRemove = this.proofRemove.bind(this);
    this.handleProofCancel = this.proofCancel.bind(this);
    this.handleBur = this.blur.bind(this);
  }

  blur() {
    const { updateValues, form } = this.props;
    updateValues && updateValues(form.getFieldsValue());
  }

  proofChange(file?: UploadFile, base64?: string) {
    this.setState({
      proof: file,
      proofBase64: base64,
      proofError: false,
    });
  }

  proofRemove() {
    this.setState({
      proof: undefined,
      proofBase64: undefined,
    });
  }

  proofCancel(documentId: number) {
    this.props.onRemoveDocument && this.props.onRemoveDocument(documentId);
  }

  componentWillUnmount() {
    const { offValidateStep, offValidateLater } = this.props;
    offValidateStep && offValidateStep(this.handleSubmit);
    offValidateLater && offValidateLater(this.handleLater);
  }

  componentDidMount() {
    const { onValidateStep, onValidateLater } = this.props;
    onValidateStep && onValidateStep(this.handleSubmit);
    onValidateLater && onValidateLater(this.handleLater);
  }

  getBeneficiary(values: any): any {
    const proof: any = this.state.proof;

    const updatedBeneficiary: IBeneficiaryInput = {
      documents: [],
    };

    if (proof) {
      (updatedBeneficiary as any).documents.push({
        documentTypeId: 18,
        file: proof,
        name: proof && proof.name,
        userId: values.userId,
      });
    }

    return updatedBeneficiary;
  }

  later() {
    const values: any = this.props.form.getFieldsValue();

    this.props.onSave && this.props.onSave(false, this.getBeneficiary(values));
  }

  submit() {
    const { kycSetState } = this.props;
    kycSetState({ btnLoading: true });

    this.props.form.validateFields(async (err: any, values: any) => {
      if (!err) {
        const { hasDocument } = this.state;
        const proof: any = this.state.proof;

        if (!proof && !hasDocument) {
          kycSetState({ btnLoading: false });
          this.setState({ proofError: true });
          return false;
        }

        this.props.onSave &&
          this.props.onSave(true, this.getBeneficiary(values));
      } else {
        kycSetState({ btnLoading: false });
      }
    });
  }

  render() {
    const { form, intl, className, beneficiary } = this.props;

    return (
      <Form method="#" className={className} onSubmit={this.handleSubmit}>
        <Row gutter={55}>
          <Col span={12}>
            <Proof
              childrenAfter
              documents={beneficiary && (beneficiary as any).documents.rows}
              documentsType={[18]}
              hasError={this.state.proofError}
              onChange={this.handleProofChange}
              onRemove={this.handleProofRemove}
              onCancel={this.handleProofCancel}
              title="kyc.beneficiary.form_btn_upload_proof_power"
              errorText="kyc.beneficiary.form_btn_upload_proof_power_error"
            >
              <Checkbox
                onBlur={this.handleBur}
                id="optin"
                label={<FormattedMessage id="kyc.beneficiary.power_checkbox" />}
                rules={[
                  {
                    message: intl.formatMessage({
                      id: 'kyc.beneficiary.power_checkbox_error',
                    }),
                    required: true,
                  },
                ]}
                form={form}
              />
            </Proof>
          </Col>
        </Row>
      </Form>
    );
  }
}

export default compose(
  Form.create({}),
  injectIntl,
  TempBeneficiary.hoc(),
  KycCtx.hoc(),
)(PowerForm);
