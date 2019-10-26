import { Col, Form, Row } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import { UploadFile } from 'antd/lib/upload/interface';
import { Checkbox, Country, Option, Select, Text } from 'components/Form';
import {
  DocumentStatus,
  IBeneficiaryInput,
  IDocument,
} from 'context/Beneficiaries/types';
import * as React from 'react';
import { compose } from 'react-apollo';
import {
  FormattedHTMLMessage,
  FormattedMessage,
  InjectedIntlProps,
  injectIntl,
} from 'react-intl';
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
  beneficiary?: IBeneficiaryInput;
  onRemoveDocument?: (documentId: number) => void;
}
interface IState {
  documents: IDocument[];
  proofError: boolean;
  proofs: UploadFile[];
  proofType?: number;
}

class AddressForm extends React.PureComponent<IProps, IState> {
  static getDerivedStateFromProps(props: IProps, state: IState) {
    const documents: IDocument[] = [];
    const { beneficiary } = props;
    if (
      beneficiary &&
      beneficiary.documents &&
      (beneficiary.documents as any).rows
    ) {
      (beneficiary.documents as any).rows.map((document: any) => {
        if (
          document.documentStatus !== DocumentStatus.CANCELED &&
          document.documentTypeId === 2
        ) {
          documents.push(document);
        }
      });
    }
    return {
      documents,
    };
  }
  state = {
    btnDisabled: false,
    documents: [],
    proofError: false,
    proofType: undefined,
    proofs: [],
  };

  handleBur: (node: any) => void;
  handleProofChange: (file: UploadFile) => void;
  handleProofRemove: (uid: string) => void;
  handleSubmit: () => void;
  handleLater: () => void;
  handleProofCancel: (documentId: number) => void;
  hanldeChangeProofType: (
    value: any,
    option: React.ReactElement<any> | Array<React.ReactElement<any>>,
  ) => void;
  constructor(props: any) {
    super(props);
    this.handleProofChange = this.proofChange.bind(this);
    this.handleSubmit = this.submit.bind(this);
    this.handleLater = this.later.bind(this);
    this.handleBur = this.blur.bind(this);
    this.hanldeChangeProofType = this.changeProofType.bind(this);
    this.handleProofCancel = this.proofCancel.bind(this);
    this.handleProofRemove = this.proofRemove.bind(this);
  }

  blur() {
    const { updateValues, form } = this.props;
    updateValues && updateValues(form.getFieldsValue());
  }

  changeProofType(value: any) {
    this.setState({
      proofType: parseInt(value, 10),
    });
  }

  proofCancel(documentId: number) {
    this.props.onRemoveDocument && this.props.onRemoveDocument(documentId);
  }

  proofRemove(uid: string) {
    const proofs: UploadFile[] = [];
    if (this.state.proofs) {
      this.state.proofs.map((proof: any) => {
        if (proof.uid !== uid) {
          proofs.push(proof);
        }
      });
    }
    this.setState({
      proofs,
    });
  }

  proofChange(file: UploadFile) {
    this.setState({
      proofs: [...this.state.proofs, file],
    });
  }

  getBeneficiary(values: any): any {
    const updatedBeneficiary: IBeneficiaryInput = {
      address1: values.address1,
      address2: values.address2,
      city: values.city,
      country: values.country,
      isHosted: this.state.proofType === 5,
      postcode: values.postcode,
      zipcode: values.zipcode,
    };

    updatedBeneficiary.documents = [];

    this.state.proofs.map((proof: any) => {
      (updatedBeneficiary as any).documents.push({
        documentTypeId: 2,
        file: proof,
        name: proof && proof.name,
        userId: values.userId,
      });
    });

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
        const { proofType, documents } = this.state;
        const countrProof: number = this.state.proofs.length + documents.length;
        if (proofType === 5) {
          if (countrProof < 3) {
            kycSetState({ btnLoading: false });
            this.setState({ proofError: true });
            return false;
          }
        } else {
          if (countrProof === 0) {
            kycSetState({ btnLoading: false });
            this.setState({ proofError: true });
            return false;
          }
        }
        const updatedBeneficiary = this.getBeneficiary(values);
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
    const { form, intl, beneficiary, className } = this.props;
    const { proofType, documents } = this.state;
    const userTag: any =
      beneficiary && beneficiary.userTag && JSON.parse(beneficiary.userTag);
    let isHosted: boolean = false;
    if (!proofType && userTag && userTag.isHosted) {
      isHosted = true;
    }
    if (proofType === 5) {
      isHosted = true;
    }

    return (
      <Form method="#" className={className} onSubmit={this.handleSubmit}>
        <Row>
          <div className="kyc-subtitle">
            <FormattedMessage id="kyc.personal_information.address_informations" />
          </div>
        </Row>
        <Row gutter={55}>
          <Col className="gutter-box" span={16}>
            <Text
              onBlur={this.handleBur}
              defaultValue={beneficiary && beneficiary.address1}
              form={form}
              label={<FormattedMessage id="kyc.beneficiary.form_address1" />}
              id="address1"
              rules={[
                {
                  message: intl.formatMessage({
                    id: 'kyc.beneficiary.form_address1_error',
                  }),
                  required: true,
                },
              ]}
            />
          </Col>
        </Row>
        <Row gutter={55}>
          <Col className="gutter-box" span={16}>
            <Text
              onBlur={this.handleBur}
              defaultValue={beneficiary && beneficiary.address2}
              form={form}
              label={<FormattedMessage id="kyc.beneficiary.form_address2" />}
              id="address2"
              rules={[
                {
                  message: intl.formatMessage({
                    id: 'kyc.beneficiary.form_address2_error',
                  }),
                },
              ]}
            />
          </Col>
        </Row>
        <Row gutter={55}>
          <Col className="gutter-box" span={8}>
            <Text
              onBlur={this.handleBur}
              defaultValue={beneficiary && beneficiary.postcode}
              form={form}
              label={<FormattedMessage id="kyc.beneficiary.form_zipcode" />}
              id="postcode"
              rules={[
                {
                  message: intl.formatMessage({
                    id: 'kyc.beneficiary.form_zipcode_error',
                  }),
                  required: true,
                },
              ]}
            />
          </Col>
          <Col className="gutter-box" span={8}>
            <Text
              onBlur={this.handleBur}
              defaultValue={beneficiary && beneficiary.city}
              form={form}
              label={<FormattedMessage id="kyc.beneficiary.form_city" />}
              id="city"
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
          <Col className="gutter-box" span={16}>
            <Country
              onBlur={this.handleBur}
              iso
              id={'country'}
              form={form}
              defaultValue={beneficiary && beneficiary.country}
              title="kyc.beneficiary.form_country"
              error="kyc.beneficiary.form_country_error"
            />
          </Col>
        </Row>

        <Row gutter={55}>
          <Col span={16}>
            {!documents ||
              (documents.length === 0 && (
                <Select
                  onBlur={this.handleBur}
                  defaultValue={isHosted ? '5' : ''}
                  showSearch
                  id="form_proof_id"
                  label={
                    <FormattedMessage id="kyc.beneficiary.form_proof_address" />
                  }
                  onChangeSelect={this.hanldeChangeProofType}
                  rules={[
                    {
                      message: intl.formatMessage({
                        id: 'kyc.beneficiary.form_proof_address_error',
                      }),
                      required: true,
                    },
                  ]}
                  form={form}
                  options={[
                    <Option value="1" key="1">
                      &nbsp;
                    </Option>,
                    <Option value="2" key="2">
                      <FormattedMessage id="kyc.beneficiary.form_proof_address_type_1" />
                    </Option>,
                    <Option value="3" key="3">
                      <FormattedMessage id="kyc.beneficiary.form_proof_address_type_2" />
                    </Option>,
                    <Option value="4" key="4">
                      <FormattedMessage id="kyc.beneficiary.form_proof_address_type_3" />
                    </Option>,
                    <Option value="5" key="5">
                      <FormattedMessage id="kyc.beneficiary.form_proof_address_type_4" />
                    </Option>,
                  ]}
                />
              ))}
            {!isHosted ? (
              <>
                <Proof
                  documents={documents}
                  documentsType={[2]}
                  hasError={this.state.proofError}
                  onChange={this.handleProofChange}
                  onRemove={this.handleProofRemove}
                  onCancel={this.handleProofCancel}
                  title="kyc.beneficiary.form_btn_upload_proof_address"
                  errorText="kyc.beneficiary.form_btn_upload_proof_address_error"
                />
                {!documents ||
                  (documents.length < 1 && (
                    <Row gutter={55}>
                      <Col span={16}>
                        <Checkbox
                          onBlur={this.handleBur}
                          id="optin"
                          label={
                            <FormattedMessage id="kyc.beneficiary.address_optin_checkbox" />
                          }
                          rules={[
                            {
                              message: intl.formatMessage({
                                id:
                                  'kyc.beneficiary.address_optin_checkbox_error',
                              }),
                              required: true,
                            },
                          ]}
                          form={form}
                        />
                      </Col>
                    </Row>
                  ))}
              </>
            ) : (
              <>
                <Row gutter={25}>
                  <Col span={8}>
                    <Proof
                      documents={
                        documents && documents[0] ? [documents[0]] : []
                      }
                      documentsType={[2]}
                      hasError={this.state.proofError && !documents[0]}
                      onChange={this.handleProofChange}
                      onRemove={this.handleProofRemove}
                      onCancel={this.handleProofCancel}
                      title="kyc.beneficiary.form_btn_upload_proof_address_certificate_hosted"
                      errorText="kyc.beneficiary.form_btn_upload_proof_address_certificate_hosted_error"
                    />
                  </Col>
                  <Col span={8}>
                    <Proof
                      documents={
                        documents && documents[1] ? [documents[1]] : []
                      }
                      documentsType={[2]}
                      hasError={this.state.proofError && !documents[1]}
                      onChange={this.handleProofChange}
                      onRemove={this.handleProofRemove}
                      onCancel={this.handleProofCancel}
                      title="kyc.beneficiary.form_btn_upload_proof_id_hosted"
                      errorText="kyc.beneficiary.form_btn_upload_proof_id_hosted_error"
                    />
                  </Col>
                  <Col span={8}>
                    <Proof
                      documents={
                        documents && documents[2] ? [documents[2]] : []
                      }
                      documentsType={[2]}
                      hasError={this.state.proofError && !documents[2]}
                      onChange={this.handleProofChange}
                      onRemove={this.handleProofRemove}
                      onCancel={this.handleProofCancel}
                      title="kyc.beneficiary.form_btn_upload_proof_address_hosted"
                      errorText="kyc.beneficiary.form_btn_upload_proof_address_hosted_error"
                    />
                  </Col>
                </Row>
                {!documents ||
                  (documents.length < 3 && (
                    <>
                      <Row gutter={55}>
                        <Col span={16}>
                          <Checkbox
                            onBlur={this.handleBur}
                            id="optin1"
                            label={
                              <FormattedMessage id="kyc.beneficiary.address_optin1_checkbox" />
                            }
                            rules={[
                              {
                                message: intl.formatMessage({
                                  id:
                                    'kyc.beneficiary.address_optin1_checkbox_error',
                                }),
                                required: true,
                              },
                            ]}
                            form={form}
                          />
                        </Col>
                      </Row>
                      <Row gutter={55}>
                        <Col span={16}>
                          <Checkbox
                            onBlur={this.handleBur}
                            id="optin2"
                            label={
                              <FormattedMessage id="kyc.beneficiary.address_optin2_checkbox" />
                            }
                            rules={[
                              {
                                message: intl.formatMessage({
                                  id:
                                    'kyc.beneficiary.address_optin2_checkbox_error',
                                }),
                                required: true,
                              },
                            ]}
                            form={form}
                          />
                        </Col>
                      </Row>
                      <Row gutter={55}>
                        <Col span={16}>
                          <Checkbox
                            onBlur={this.handleBur}
                            id="optin3"
                            label={
                              <FormattedMessage id="kyc.beneficiary.address_optin3_checkbox" />
                            }
                            rules={[
                              {
                                message: intl.formatMessage({
                                  id:
                                    'kyc.beneficiary.address_optin3_checkbox_error',
                                }),
                                required: true,
                              },
                            ]}
                            form={form}
                          />
                        </Col>
                      </Row>
                    </>
                  ))}
              </>
            )}
          </Col>
          <Col span={8} className="onboarding-form-hint">
            <div className="kyc-hint-title">
              <FormattedMessage id="kyc.beneficiary.hint_title" />
            </div>
            <div className="kyc-hint-description">
              <FormattedHTMLMessage id="kyc.beneficiary.hint_proof_address" />
            </div>
          </Col>
        </Row>
        <Row />
      </Form>
    );
  }
}

export default compose(
  Form.create({}),
  injectIntl,
  TempBeneficiary.hoc(),
  KycCtx.hoc(),
)(AddressForm);
