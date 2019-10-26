import { Col, Form, Row } from 'antd';
import { Text } from 'components/Form';
import { IInputAddress } from 'context/Addresses/types';
import * as Company from 'context/Company';
import { IInputCompany } from 'context/Company/types.d';
import * as React from 'react';
import { compose } from 'react-apollo';
import { FormattedMessage, injectIntl } from 'react-intl';
import { withRouter } from 'react-router';
import * as KycCtx from '../context';
import Manager, { IManagerProps, IManagerState } from '../Manager';
import * as TempCompany from './context/index';

interface IProps
  extends Company.InjectedProps,
    IManagerProps,
    TempCompany.InjectedProps {}
interface IState extends IManagerState {}

class Form2 extends Manager<IProps, IState> {
  static defaultProps = {
    kycProps: {
      bottomBar: true,
      btn: 'kyc.bottom.confirm',
      btnLater: 'kyc.bottom.later',
      btnLaterLink: '/',
      btnLink: '/kyc/personal-information',
      headingDescription: 'kyc.company.description',
      headingTitle: 'kyc.company.title',
      nextStep: 'PERSONNAL_INFORMATION',
      step: 'COMPANY',
    },
  };

  state = {
    btnLoading: false,
  };

  constructor(props: any) {
    super(props);
    this.save = super.save.bind(this);
  }

  async save(): Promise<boolean | undefined> {
    try {
      this.load();
      await new Promise((resolve, reject) => {
        this.props.form.validateFields(async (err: any, values: any) => {
          if (!err) {
            this.setState({ btnLoading: true });
            const { company, tempCompany } = this.props;

            const completedCompany: IInputCompany = {
              ...tempCompany,
              addresses: [
                {
                  ...(tempCompany &&
                    tempCompany.addresses &&
                    tempCompany.addresses[0]),
                  address1: values.address1,
                  address2: values.address2,
                  city: values.city,
                  country: values.country,
                  zipcode: parseInt(values.zipcode, 10),
                },
              ],
            };
            if (company && company.create) {
              const result = await company.create(undefined, completedCompany);
              if (result) {
                super.save();
                resolve();
              } else {
                this.onError();
                reject();
              }
            }
          } else {
            this.onError();
          }
        });
      });
    } catch (e) {
      this.onError();
      return false;
    }
  }

  render() {
    const { tempCompany, form, intl, location } = this.props;
    const address: IInputAddress | undefined =
      tempCompany &&
      tempCompany.addresses &&
      tempCompany.addresses &&
      tempCompany.addresses[0] &&
      tempCompany.addresses[0];

    return super._render(
      <>
        <Row gutter={28}>
          <Col xs={24} lg={12} />
        </Row>
        <Row gutter={28}>
          <Col xs={24} lg={12}>
            <Text
              defaultValue={address && address.address1}
              id="address1"
              label={<FormattedMessage id="kyc.company.form_address1" />}
              rules={[
                {
                  message: intl.formatMessage({
                    id: 'kyc.company.form_address1_error',
                  }),
                  required: true,
                },
              ]}
              form={form}
            />
          </Col>
        </Row>
        <Row gutter={28}>
          <Col xs={24} lg={12}>
            <Text
              defaultValue={address && address.address2}
              id="address2"
              label={<FormattedMessage id="kyc.company.form_address2" />}
              form={form}
            />
          </Col>
        </Row>
        <Row gutter={28}>
          <Col xs={12} lg={6}>
            <Text
              defaultValue={address && address.zipcode}
              id="zipcode"
              label={<FormattedMessage id="kyc.company.form_zipcode" />}
              form={form}
            />
          </Col>
          <Col xs={12} lg={6}>
            <Text
              defaultValue={address && address.city}
              id="city"
              label={<FormattedMessage id="kyc.company.form_city" />}
              form={form}
            />
          </Col>
        </Row>
        <Row gutter={28}>
          <Col xs={24} lg={12}>
            <Text
              defaultValue={address && address.country}
              id="country"
              label={<FormattedMessage id="kyc.company.form_country" />}
              form={form}
            />
          </Col>
        </Row>
      </>,
    );
  }
}

export default compose(
  Form.create({}),
  withRouter,
  TempCompany.hoc(),
  KycCtx.hoc(),
  Company.hoc(),
  injectIntl,
)(Form2);
