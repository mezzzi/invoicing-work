import { Col, Form, Row } from 'antd';
import { CheckboxChangeEvent } from 'antd/lib/checkbox';
import { FormComponentProps } from 'antd/lib/form';
import { UploadFile } from 'antd/lib/upload/interface';
import { BtnType, Button } from 'components/Button';
import { Dialog } from 'components/Dialog';
import {
  Checkbox,
  Country,
  Date,
  Option,
  Radios,
  Select,
  Text,
} from 'components/Form';
import {
  DocumentStatus,
  IBeneficiaryInput,
  IUserTitle,
} from 'context/Beneficiaries/types';
import * as React from 'react';
import { compose } from 'react-apollo';
import {
  FormattedHTMLMessage,
  FormattedMessage,
  InjectedIntlProps,
  injectIntl,
} from 'react-intl';
import PDF from 'react-pdf-js';
import { toPickerDate, toServerDate } from 'utils/common';
import * as KycCtx from '../context';
import Proof from '../Proof';
import * as TempBeneficiary from './context/index';

interface IProps
  extends FormComponentProps,
    InjectedIntlProps,
    TempBeneficiary.InjectedProps,
    KycCtx.InjectedProps {
  className?: string;
  onSave?: (next: boolean, beneficiary?: IBeneficiaryInput) => void;
  isCurrent?: boolean;
  onRemoveDocument?: (documentId: number) => void;
  beneficiary?: IBeneficiaryInput;
}
interface IState {
  hasDocument: boolean;
  proofError: boolean;
  proof?: UploadFile;
  proofBase64?: string;
  proofValidated: boolean;
  proofChecked: boolean;
  countChecked: number;
}

class CommonForm extends React.PureComponent<IProps, IState> {
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
            (document.documentTypeId === 9 ||
              document.documentTypeId === 17 ||
              document.documentTypeId === 15)
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
    countChecked: 0,
    hasDocument: false,
    proof: undefined,
    proofBase64: undefined,
    proofChecked: false,
    proofError: false,
    proofValidated: false,
  };

  handleBur: (node: any) => void;
  handleProofChange: (file?: UploadFile, base64?: string) => void;
  handleSubmit: () => void;
  handleLater: () => void;
  handleCheckChange: (e: CheckboxChangeEvent) => void;
  handleCancelProof: () => void;
  handleValidateProof: () => void;
  handleProofRemove: (uid: string) => void;
  handleProofCancel: (documentId: number) => void;

  proofRef: any;
  constructor(props: any) {
    super(props);
    this.proofRef = React.createRef();
    this.handleProofChange = this.proofChange.bind(this);
    this.handleSubmit = this.submit.bind(this);
    this.handleLater = this.later.bind(this);
    this.handleBur = this.blur.bind(this);
    this.handleCheckChange = this.checkChange.bind(this);
    this.handleCancelProof = this.cancelProof.bind(this);
    this.handleValidateProof = this.validateProof.bind(this);
    this.handleProofRemove = this.proofRemove.bind(this);
    this.handleProofCancel = this.proofCancel.bind(this);
  }

  blur() {
    const { updateValues, form } = this.props;
    updateValues && updateValues(form.getFieldsValue());
  }

  cancelProof() {
    this.setState({
      countChecked: 0,
      proof: undefined,
      proofBase64: undefined,
      proofChecked: false,
      proofError: false,
      proofValidated: false,
    });
    this.proofRef.current.onRemove();
  }

  validateProof() {
    this.setState({
      proofValidated: true,
    });
  }

  checkChange(e: CheckboxChangeEvent) {
    const newCount: number = e.target.checked
      ? this.state.countChecked + 1
      : this.state.countChecked - 1;
    this.setState({
      countChecked: newCount,
      proofChecked: newCount === 5 ? true : false,
    });
  }

  proofChange(file?: UploadFile, base64?: string) {
    this.setState({
      countChecked: 0,
      proof: file,
      proofBase64: base64,
      proofChecked: false,
      proofError: false,
      proofValidated: false,
    });
  }

  proofRemove() {
    this.setState({
      countChecked: 0,
      proof: undefined,
      proofBase64: undefined,
      proofChecked: false,
      proofError: false,
      proofValidated: false,
    });
  }

  proofCancel(documentId: number) {
    this.props.onRemoveDocument && this.props.onRemoveDocument(documentId);
  }

  getBeneficiary(values: any): any {
    const proof: any = this.state.proof;

    const updatedBeneficiary: IBeneficiaryInput = {
      birthCountry: values.birthCountry,
      birthday: values.birthday ? toServerDate(values.birthday) : '',
      firstname: values.firstname,
      lastname: values.lastname,
      nationality: values.nationality,
      phone: values.phone,
      placeOfBirth: values.placeOfBirth,
      title: values.title,
    };

    if (proof) {
      updatedBeneficiary.documents = [
        {
          documentTypeId: values.form_proof_id
            ? parseInt(values.form_proof_id, 10)
            : 9,
          file: proof,
          name: proof && proof.name,
          userId: values.userId,
        },
      ];
    }

    return updatedBeneficiary;
  }

  later() {
    const values: any = this.props.form.getFieldsValue();

    if (values.firstname) {
      this.props.onSave &&
        this.props.onSave(false, this.getBeneficiary(values));
    } else {
      if (
        values.birthCountry !== null ||
        values.birthday !== null ||
        values.form_proof_id !== null ||
        values.lastname !== null ||
        values.nationality !== null ||
        values.phone !== null ||
        values.placeOfBirth !== null
      ) {
        this.props.form.setFields({
          firstname: {
            errors: [
              new Error(
                this.props.intl.formatMessage({
                  id: 'kyc.beneficiary.form_firstname_error',
                }),
              ),
            ],
            value: values.firstname,
          },
        });
      } else {
        this.props.onSave && this.props.onSave(false);
      }
    }
  }

  submit() {
    const { kycSetState } = this.props;
    kycSetState({ btnLoading: true });

    this.props.form.validateFields(async (err: any, values: any) => {
      if (!err) {
        const updatedBeneficiary = this.getBeneficiary(values);
        const proof: any = this.state.proof;

        const { hasDocument } = this.state;

        if (!proof && !hasDocument) {
          kycSetState({ btnLoading: false });
          this.setState({ proofError: true });
          return false;
        }

        this.props.onSave && this.props.onSave(true, updatedBeneficiary);
      } else {
        kycSetState({ btnLoading: false });
      }
    });
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

  render() {
    const { form, intl, beneficiary, className, isCurrent } = this.props;
    const { proofValidated, proof, proofChecked, proofBase64 } = this.state;

    return (
      <Form method="#" className={className} onSubmit={this.handleSubmit}>
        <Row>
          <div className="kyc-subtitle">
            <FormattedMessage id="kyc.personal_information.main_informations" />
          </div>
        </Row>
        <br />
        <Radios
          defaultValue={beneficiary ? beneficiary.title : IUserTitle.M}
          form={form}
          id="title"
          rules={[
            {
              message: intl.formatMessage({
                id: 'kyc.beneficiary.form_title_error',
              }),
              required: true,
            },
          ]}
          values={[
            {
              label: <FormattedMessage id="kyc.beneficiary.form_man" />,
              value: IUserTitle.M,
            },
            {
              label: <FormattedMessage id="kyc.beneficiary.form_woman" />,
              value: IUserTitle.MME,
            },
          ]}
        />
        <Row gutter={55}>
          <Col className="gutter-box" span={8}>
            <Text
              onBlur={this.handleBur}
              defaultValue={beneficiary && beneficiary.firstname}
              form={form}
              label={<FormattedMessage id="kyc.beneficiary.form_firstname" />}
              id="firstname"
              rules={[
                {
                  message: intl.formatMessage({
                    id: 'kyc.beneficiary.form_firstname_error',
                  }),
                  required: true,
                },
              ]}
            />
          </Col>
          <Col className="gutter-box" span={8}>
            <Text
              onBlur={this.handleBur}
              defaultValue={beneficiary && beneficiary.lastname}
              form={form}
              label={<FormattedMessage id="kyc.beneficiary.form_lastname" />}
              id="lastname"
              rules={[
                {
                  message: intl.formatMessage({
                    id: 'kyc.beneficiary.form_lastname_error',
                  }),
                  required: true,
                },
              ]}
            />
          </Col>
          {isCurrent && (
            <Col className="gutter-box" span={8}>
              <Text
                onBlur={this.handleBur}
                defaultValue={beneficiary && beneficiary.phone}
                form={form}
                label={<FormattedMessage id="kyc.beneficiary.form_phone" />}
                id="phone"
                rules={[
                  {
                    message: intl.formatMessage({
                      id: 'kyc.beneficiary.form_phone_error',
                    }),
                    required: true,
                  },
                ]}
              />
            </Col>
          )}
        </Row>
        <Row gutter={55}>
          <Col className="gutter-box" span={16}>
            <Country
              onBlur={this.handleBur}
              iso
              id={'nationality'}
              form={form}
              defaultValue={beneficiary && beneficiary.nationality}
              title="kyc.beneficiary.form_nationality"
              error="kyc.beneficiary.form_nationality_error"
            />
          </Col>
        </Row>
        <Row>
          <div className="kyc-subtitle">
            <FormattedMessage id="kyc.personal_information.birth_informations" />
          </div>
        </Row>
        <Row gutter={55}>
          <Col className="gutter-box" span={8}>
            <Date
              onBlur={this.handleBur}
              defaultValue={
                beneficiary && beneficiary.birthday && beneficiary.birthday
                  ? toPickerDate(beneficiary.birthday)
                  : null
              }
              form={form}
              label={<FormattedMessage id="kyc.beneficiary.form_birthday" />}
              id="birthday"
              rules={[
                {
                  message: intl.formatMessage({
                    id: 'kyc.beneficiary.form_birthday_error',
                  }),
                  required: true,
                },
              ]}
            />
          </Col>
          <Col className="gutter-box" span={8}>
            <Country
              onBlur={this.handleBur}
              iso
              id={'birthCountry'}
              form={form}
              defaultValue={beneficiary && beneficiary.birthCountry}
              title="kyc.beneficiary.form_birth_country"
              error="kyc.beneficiary.form_birth_country_error"
            />
          </Col>
        </Row>
        <Row gutter={55}>
          <Col className="gutter-box" span={16}>
            <Text
              onBlur={this.handleBur}
              defaultValue={beneficiary && beneficiary.placeOfBirth}
              form={form}
              label={<FormattedMessage id="kyc.beneficiary.form_city" />}
              id="placeOfBirth"
              rules={[
                {
                  message: intl.formatMessage({
                    id: 'kyc.beneficiary.form_city_error',
                  }),
                  required: true,
                },
              ]}
            />
          </Col>
        </Row>
        <Row gutter={55}>
          <Col span={16}>
            <Proof
              ref={this.proofRef}
              documents={beneficiary && (beneficiary as any).documents.rows}
              documentsType={[9, 17, 15]}
              hasError={this.state.proofError}
              onChange={this.handleProofChange}
              onRemove={this.handleProofRemove}
              onCancel={this.handleProofCancel}
              title="kyc.beneficiary.form_btn_upload_proof_id"
              errorText="kyc.beneficiary.form_btn_upload_proof_id_error"
            >
              <Select
                defaultValue=""
                showSearch
                id="form_proof_id"
                label={
                  <FormattedMessage id="kyc.beneficiary.form_proof_id_type" />
                }
                rules={[
                  {
                    message: intl.formatMessage({
                      id: 'kyc.beneficiary.form_proof_id_type_error',
                    }),
                    required: true,
                  },
                ]}
                form={form}
                options={[
                  <Option value="" key="1">
                    &nbsp;
                  </Option>,
                  <Option value="9" key="9">
                    <FormattedMessage id="kyc.beneficiary.form_proof_id_type_1" />
                  </Option>,
                  <Option value="17" key="17">
                    <FormattedMessage id="kyc.beneficiary.form_proof_id_type_2" />
                  </Option>,
                  <Option value="15" key="15">
                    <FormattedMessage id="kyc.beneficiary.form_proof_id_type_3" />
                  </Option>,
                ]}
              />
            </Proof>
            {proofBase64 && (
              <Dialog
                visible={!proofValidated}
                closable={false}
                footerVisible={false}
                // footerClick={this.handleFooterClick}
                className="quality-assurance-dialog"
              >
                <div className="quality-assurance-preview">
                  <div className="quality-assurance-form">
                    <div className="quality-assurance-title">
                      <FormattedMessage id="kyc.beneficiary.quality_title" />
                    </div>
                    <Checkbox
                      onCheck={this.handleCheckChange}
                      id="quality-assurance-checkbox-1"
                      label={
                        <FormattedMessage id="kyc.beneficiary.quality_assurance_checkbox_1" />
                      }
                      form={form}
                    />
                    <Checkbox
                      onCheck={this.handleCheckChange}
                      id="quality-assurance-checkbox-2"
                      label={
                        <FormattedMessage id="kyc.beneficiary.quality_assurance_checkbox_2" />
                      }
                      form={form}
                    />
                    <Checkbox
                      onCheck={this.handleCheckChange}
                      id="quality-assurance-checkbox-3"
                      label={
                        <FormattedMessage id="kyc.beneficiary.quality_assurance_checkbox_3" />
                      }
                      form={form}
                    />
                    <Checkbox
                      onCheck={this.handleCheckChange}
                      id="quality-assurance-checkbox-4"
                      label={
                        <FormattedMessage id="kyc.beneficiary.quality_assurance_checkbox_4" />
                      }
                      form={form}
                    />
                    <Checkbox
                      onCheck={this.handleCheckChange}
                      id="quality-assurance-checkbox-5"
                      label={
                        <FormattedMessage id="kyc.beneficiary.quality_assurance_checkbox_5" />
                      }
                      form={form}
                    />
                    <Button
                      onClick={this.handleCancelProof}
                      type={BtnType.Default}
                    >
                      <FormattedMessage id="kyc.beneficiary.quality_assurance_cancel" />
                    </Button>
                    <Button
                      disabled={!proofChecked}
                      onClick={this.handleValidateProof}
                      type={BtnType.Primary}
                    >
                      <FormattedMessage id="kyc.beneficiary.quality_assurance_valid" />
                    </Button>
                  </div>
                  <div className="preview-content">
                    {(proofBase64 as string).indexOf(
                      'data:application/pdf;base64',
                    ) > -1 ? (
                      <PDF file={proofBase64} />
                    ) : (
                      <img src={proofBase64} />
                    )}
                  </div>
                </div>
              </Dialog>
            )}
          </Col>
          <Col span={8} className="onboarding-form-hint">
            <div className="kyc-hint-title">
              <FormattedMessage id="kyc.beneficiary.hint_title" />
            </div>
            <div className="kyc-hint-description">
              <FormattedHTMLMessage id="kyc.beneficiary.hint_proof_id" />
            </div>
          </Col>
        </Row>
      </Form>
    );
  }
}

export default compose(
  Form.create({}),
  injectIntl,
  KycCtx.hoc(),
  TempBeneficiary.hoc(),
)(CommonForm);
