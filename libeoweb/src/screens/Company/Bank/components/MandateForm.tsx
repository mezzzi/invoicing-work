import { Col, Form, Row } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import { Card } from 'components/Card';
import { Text } from 'components/Form';
import { A, Div, H3 } from 'components/Typo';
import { IBankAccount } from 'context/Bank/types';
import { ICompany } from 'context/Company/types.d';
import * as User from 'context/User';
import { IUser } from 'context/User/types';
import * as React from 'react';
import { compose } from 'react-apollo';
import { FormattedMessage, InjectedIntlProps, injectIntl } from 'react-intl';
import { Link } from 'react-router-dom';

interface IProps
  extends FormComponentProps,
    User.InjectedProps,
    InjectedIntlProps {
  onSubmit?: () => void;
  bank?: IBankAccount;
}

const MandateForm: React.FunctionComponent<IProps> = ({
  onSubmit = () => {},
  user,
  form,
  intl,
  bank = {} as IBankAccount,
}) => {
  const me: IUser = user && user.data && user.data.me;
  const currentCompany: ICompany = me && me.currentCompany;

  return (
    <Card primary center={false}>
      <H3>
        <FormattedMessage id="bank.mandate_add_form.title" />
      </H3>
      <Div className="heading-description">
        <FormattedMessage id="bank.mandate_add_form.description" />
      </Div>
      <H3
        css={{
          primaryColor: true,
          uppercase: true,
        }}
      >
        <FormattedMessage id="bank.mandate.subtitle" />
      </H3>
      <Form className="form-mandate" onSubmit={onSubmit}>
        <Row gutter={28}>
          <Col span={8}>
            <Text
              disabled
              id="name"
              defaultValue={currentCompany.name || currentCompany.brandName}
              label={<FormattedMessage id="bank.mandate.name" />}
              rules={[
                {
                  message: intl.formatMessage({
                    id: 'bank.mandate.name_error',
                  }),
                  required: true,
                },
              ]}
              form={form}
            />
          </Col>
        </Row>
        <Row gutter={28}>
          <Col span={8}>
            <Text
              disabled
              id="address1"
              defaultValue={
                currentCompany.addresses &&
                currentCompany.addresses.rows &&
                currentCompany.addresses.rows[0] &&
                currentCompany.addresses.rows[0].address1
              }
              label={<FormattedMessage id="bank.mandate.address1" />}
              rules={[
                {
                  message: intl.formatMessage({
                    id: 'bank.mandate.address1_error',
                  }),
                  required: true,
                },
              ]}
              form={form}
            />
          </Col>
          <Col span={8}>
            <Text
              disabled
              id="city"
              defaultValue={
                currentCompany.addresses &&
                currentCompany.addresses.rows &&
                currentCompany.addresses.rows[0] &&
                currentCompany.addresses.rows[0].city
              }
              label={<FormattedMessage id="bank.mandate.city" />}
              rules={[
                {
                  message: intl.formatMessage({
                    id: 'bank.mandate.city_error',
                  }),
                  required: true,
                },
              ]}
              form={form}
            />
          </Col>
        </Row>
        <Row gutter={28}>
          <Col span={8}>
            <Text
              disabled
              id="zipcode"
              defaultValue={
                currentCompany.addresses &&
                currentCompany.addresses.rows &&
                currentCompany.addresses.rows[0] &&
                currentCompany.addresses.rows[0].zipcode
              }
              label={<FormattedMessage id="bank.mandate.zipcode" />}
              rules={[
                {
                  message: intl.formatMessage({
                    id: 'bank.mandate.zipcode_error',
                  }),
                  required: true,
                },
              ]}
              form={form}
            />
          </Col>
          <Col span={8}>
            <Text
              disabled
              id="country"
              defaultValue={
                currentCompany.addresses &&
                currentCompany.addresses.rows &&
                currentCompany.addresses.rows[0] &&
                currentCompany.addresses.rows[0].country
              }
              label={<FormattedMessage id="bank.mandate.country" />}
              rules={[
                {
                  message: intl.formatMessage({
                    id: 'bank.mandate.country_error',
                  }),
                  required: true,
                },
              ]}
              form={form}
            />
          </Col>
        </Row>
        <Row gutter={28}>
          <Col span={16}>
            <Text
              id="iban"
              defaultValue={bank.iban && bank.iban.iban}
              disabled
              label={<FormattedMessage id="bank.mandate.iban" />}
              form={form}
            />
          </Col>
        </Row>
        <Row gutter={28}>
          <Col span={8}>
            <Text
              id="bic"
              defaultValue={bank.iban && bank.iban.bic}
              disabled
              label={<FormattedMessage id="bank.mandate.bic" />}
              form={form}
            />
          </Col>
          <Col span={8}>
            <Text
              id="bankName"
              disabled
              defaultValue={bank.iban && bank.iban.bank}
              label={<FormattedMessage id="bank.mandate.bank_name" />}
              form={form}
            />
          </Col>
        </Row>
      </Form>
      <Link to="/company/informations">
        <A tag="div">
          <FormattedMessage id="bank.mandate.link_edit" />
        </A>
      </Link>
    </Card>
  );
};

export default compose(
  injectIntl,
  Form.create({}),
  User.hoc(),
)(MandateForm);
