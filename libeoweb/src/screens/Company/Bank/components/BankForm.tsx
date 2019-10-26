import { Col, Form, Row } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import { IconValue } from 'components/Assets/Icon';
import { BtnType, Button } from 'components/Button';
import { Card } from 'components/Card';
import { Text } from 'components/Form';
import ControlIban from 'components/Form/ControlIban';
import { Content } from 'components/Layout';
import { H3, Heading } from 'components/Typo';
import { IBankAccount, IInputBankAccount } from 'context/Bank/types';
import { ICompany } from 'context/Company/types.d';
import * as Iban from 'context/Iban';
import { IIban } from 'context/Iban/types';
import * as User from 'context/User';
import { IUser } from 'context/User/types';
import * as React from 'react';
import { compose } from 'react-apollo';
import { FormattedMessage, InjectedIntlProps, injectIntl } from 'react-intl';
import { RouteComponentProps } from 'react-router';
import history from 'store/history';
import { isIban } from 'utils/common';

interface IProps
  extends FormComponentProps,
    User.InjectedProps,
    InjectedIntlProps {
  onSubmit?: () => void;
  onClose?: () => void;
  bank?: IBankAccount;
}

const BankForm: React.FunctionComponent<IProps> = ({
  onSubmit = () => {},
  onClose = () => {},
  user,
  form,
  intl,
  bank = {} as IBankAccount,
}) => {
  const iban: IIban = (bank && bank.iban) || {};
  const [bic, setBic] = React.useState(iban.bic);
  const [bankName, setBankName] = React.useState(iban.bank);

  const me: IUser = user && user.data && user.data.me;
  const currentCompany: ICompany = me && me.currentCompany;

  const ibanUpdate = (newIban: any) => {
    setBankName(newIban.name);
    setBic(newIban.bic);
  };

  return (
    <Card onClose={onClose} primary center={false}>
      <H3
        css={{
          primaryColor: true,
          uppercase: true,
        }}
      >
        <FormattedMessage id="bank.form.title" />
      </H3>
      <Form className="form-bank" onSubmit={onSubmit}>
        <Row gutter={28}>
          <Col span={8}>
            <Text
              id="label"
              defaultValue={bank.label}
              label={<FormattedMessage id="bank.form.label" />}
              rules={[
                {
                  message: intl.formatMessage({
                    id: 'bank.form.label_error',
                  }),
                  required: true,
                },
              ]}
              form={form}
            />
          </Col>
          <Col span={8}>
            <Iban.Provider siren={currentCompany.siren}>
              <ControlIban
                onChange={ibanUpdate}
                disabled={bank && bank.id ? true : false}
                value={bank.iban && bank.iban.iban}
                siren={currentCompany.siren}
                form={form}
              />
            </Iban.Provider>
          </Col>
        </Row>
        <Row gutter={28}>
          <Col span={8}>
            <Text
              id="bic"
              defaultValue={bic}
              disabled
              label={<FormattedMessage id="bank.form.bic" />}
              form={form}
            />
          </Col>
          <Col span={8}>
            <Text
              id="bankName"
              disabled
              defaultValue={bankName}
              label={<FormattedMessage id="bank.form.bank_name" />}
              form={form}
            />
          </Col>
        </Row>
        <Row type="flex" justify="end">
          <Button submit type={BtnType.Primary}>
            {bank.id ? (
              <FormattedMessage id="bank.form.update" />
            ) : (
              <FormattedMessage id="bank.form.submit" />
            )}
          </Button>
        </Row>
      </Form>
    </Card>
  );
};

export default compose(
  injectIntl,
  Form.create({}),
  User.hoc(),
)(BankForm);
