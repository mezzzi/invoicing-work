import { Col, Form, Row } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import { Option, Select, Text } from 'components/Form';
import { IBeneficiaryInput } from 'context/Beneficiaries/types';
import * as React from 'react';
import { compose } from 'react-apollo';
import { FormattedMessage, InjectedIntlProps, injectIntl } from 'react-intl';
import * as KycCtx from '../context';
import * as TempBeneficiary from './context/index';

interface IProps
  extends FormComponentProps,
    InjectedIntlProps,
    TempBeneficiary.InjectedProps,
    KycCtx.InjectedProps {
  className?: string;
  onSave?: (next: boolean, beneficiary: IBeneficiaryInput) => void;
  beneficiary?: IBeneficiaryInput;
}
interface IState {}

class ComplementaryForm extends React.PureComponent<IProps, IState> {
  state = {
    btnDisabled: false,
  };

  handleSubmit: () => void;
  handleLater: () => void;
  handleBur: (node: any) => void;
  onChangeType: (value: any) => void;
  constructor(props: any) {
    super(props);
    this.handleSubmit = this.submit.bind(this);
    this.handleLater = this.later.bind(this);
    this.handleBur = this.blur.bind(this);
    this.onChangeType = this.changeType.bind(this);
  }

  changeType(value: any) {
    const { updateValues } = this.props;
    updateValues &&
      updateValues({
        controllingPersonType: value,
      });
  }

  blur() {
    const { updateValues, form } = this.props;
    updateValues && updateValues(form.getFieldsValue());
  }

  getBeneficiary(values: any): any {
    const controllingPersonType = parseInt(values.controllingPersonType, 10);

    const updatedBeneficiary: IBeneficiaryInput = {
      controllingPersonType,
      incomeRange: values.incomeRange,
      occupation:
        controllingPersonType === 1 ? 'actionnaire' : values.occupation,
      personalAssets: values.personalAssets,
      taxResidence: values.taxResidence,
    };

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
        this.props.onSave &&
          this.props.onSave(true, this.getBeneficiary(values));
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
    const { form, intl, beneficiary, className, values } = this.props;

    const controllingPersonType = !values
      ? beneficiary && beneficiary.controllingPersonType
      : values && parseInt(values.controllingPersonType, 10);

    return (
      <Form method="#" className={className} onSubmit={this.handleSubmit}>
        <Row gutter={55}>
          <Col className="gutter-box" span={16}>
            <Select
              onChangeSelect={this.onChangeType}
              onBlur={this.handleBur}
              defaultValue={controllingPersonType && `${controllingPersonType}`}
              showSearch
              id="controllingPersonType"
              label={
                <FormattedMessage id="kyc.beneficiary.form_beneficiary_type" />
              }
              rules={[
                {
                  message: intl.formatMessage({
                    id: 'kyc.beneficiary.form_beneficiary_type_error',
                  }),
                  required: true,
                },
              ]}
              form={form}
              options={[
                <Option value="" key="0">
                  &nbsp;
                </Option>,
                <Option value="1" key="1">
                  <FormattedMessage id="kyc.beneficiary.form_beneficiary_type_1" />
                </Option>,
                <Option value="2" key="2">
                  <FormattedMessage id="kyc.beneficiary.form_beneficiary_type_2" />
                </Option>,
                <Option value="3" key="3">
                  <FormattedMessage id="kyc.beneficiary.form_beneficiary_type_3" />
                </Option>,
              ]}
            />
          </Col>
        </Row>
        {controllingPersonType !== 1 && (
          <Row gutter={55}>
            <Col className="gutter-box" span={16}>
              <Text
                onBlur={this.handleBur}
                defaultValue={beneficiary && beneficiary.occupation}
                form={form}
                label={<FormattedMessage id="kyc.beneficiary.form_job" />}
                id="occupation"
                rules={[
                  {
                    message: intl.formatMessage({
                      id: 'kyc.beneficiary.form_job_error',
                    }),
                    required: true,
                  },
                ]}
              />
            </Col>
          </Row>
        )}
        <Row gutter={55}>
          <Col className="gutter-box" span={8}>
            <Select
              onBlur={this.handleBur}
              defaultValue={beneficiary && beneficiary.incomeRange}
              showSearch
              id="incomeRange"
              label={<FormattedMessage id="kyc.beneficiary.form_income" />}
              rules={[
                {
                  message: intl.formatMessage({
                    id: 'kyc.beneficiary.form_income_error',
                  }),
                  required: true,
                },
              ]}
              form={form}
              options={[
                <Option value="" key="1">
                  &nbsp;
                </Option>,
                <Option key="0-18" value="0-18">
                  0-18000 €
                </Option>,
                <Option key="19-23" value="19-23">
                  19000-23000 €
                </Option>,
                <Option key="24-27" value="24-27">
                  24000-27000 €
                </Option>,
                <Option key="28-35" value="28-35">
                  28000-35000 €
                </Option>,
                <Option key="36-56" value="36-56">
                  36000-56000 €
                </Option>,
                <Option key="57" value="57">
                  57000 €
                </Option>,
              ]}
            />
          </Col>
          <Col className="gutter-box" span={8}>
            <Select
              onBlur={this.handleBur}
              defaultValue={beneficiary && beneficiary.personalAssets}
              showSearch
              id="personalAssets"
              label={<FormattedMessage id="kyc.beneficiary.form_patrimony" />}
              rules={[
                {
                  message: intl.formatMessage({
                    id: 'kyc.beneficiary.form_patrimony_error',
                  }),
                  required: true,
                },
              ]}
              form={form}
              options={[
                <Option value="" key="1">
                  &nbsp;
                </Option>,
                <Option key="0-2" value="0-2">
                  0-2000 €
                </Option>,
                <Option key="3-22" value="3-22">
                  3000-22000 €
                </Option>,
                <Option key="23-128" value="23-128">
                  23000-128000 €
                </Option>,
                <Option key="129-319" value="129-319">
                  129000-319000 €
                </Option>,
                <Option key="320-464" value="320-464">
                  320000-464000 €
                </Option>,
                <Option key="465-" value="465-">
                  465000 €
                </Option>,
              ]}
            />
          </Col>
        </Row>
        {beneficiary &&
          (beneficiary.country !== 'FR' ||
            beneficiary.birthCountry !== 'FR' ||
            beneficiary.nationality !== 'FR') && (
            <>
              <Row>
                <div className="kyc-subtitle">
                  <FormattedMessage id="kyc.personal_information.tax_residence_title" />
                </div>
              </Row>
              <Row gutter={55}>
                <Col className="gutter-box" span={16}>
                  <Text
                    onBlur={this.handleBur}
                    defaultValue={beneficiary && beneficiary.taxResidence}
                    form={form}
                    label={
                      <FormattedMessage id="kyc.personal_information.tax_residence" />
                    }
                    id="taxResidence"
                    rules={[
                      {
                        message: intl.formatMessage({
                          id: 'kyc.personal_information.tax_residence_error',
                        }),
                        required: true,
                      },
                    ]}
                  />
                </Col>
              </Row>
            </>
          )}
      </Form>
    );
  }
}

export default compose(
  Form.create({}),
  injectIntl,
  TempBeneficiary.hoc(),
  KycCtx.hoc(),
)(ComplementaryForm);
