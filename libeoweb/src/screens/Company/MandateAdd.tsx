import { Col, Form, Row } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import { IconValue } from 'components/Assets/Icon';
import { BtnType, Button } from 'components/Button';
import { Card } from 'components/Card';
import { DialogCode } from 'components/Dialog';
import { Text } from 'components/Form';
import { Content, FloatingActionFooter } from 'components/Layout';
import { A, Div, H3, Heading } from 'components/Typo';
import * as BankCtx from 'context/Bank';
import { IBankAccount, IMandate } from 'context/Bank/types';
import { ICompany } from 'context/Company/types.d';
import * as User from 'context/User';
import { IUser } from 'context/User/types';
import * as React from 'react';
import { compose } from 'react-apollo';
import { FormattedMessage, InjectedIntlProps, injectIntl } from 'react-intl';
import { RouteComponentProps } from 'react-router';
import { Link } from 'react-router-dom';
import history from 'store/history';
import './Bank.module.less';

interface IProps
  extends RouteComponentProps,
    FormComponentProps,
    InjectedIntlProps,
    User.InjectedProps {}

interface IState {
  modalVisible: boolean;
  mandateId?: string;
}

class MandateAdd extends React.PureComponent<IProps, IState> {
  static getDerivedStateFromProps(props: IProps, state: IState) {
    const match: any = props.match;
    if (!state.mandateId) {
      const mandateId = match && match.params && match.params.mandateId;
      if (mandateId) {
        return {
          mandateId,
        };
      }
    }
    return null;
  }
  state = {
    mandateId: undefined,
    modalVisible: false,
  };

  constructor(props: any) {
    super(props);
  }

  submit = async (
    bankId: string,
    createMandate?: (bankAccountId?: string) => Promise<IMandate | null>,
    e?: React.FormEvent,
  ) => {
    e && e.preventDefault();

    if (bankId && createMandate) {
      const mandate = await createMandate(bankId);

      if (mandate) {
        this.setState({
          mandateId: mandate.id,
          modalVisible: true,
        });
      }
    }
  };

  later = () => {
    history.push('/company/bank');
  };

  close = async (
    sign?: (mandateId: string, code: string) => Promise<IMandate | null>,
    refetch?: () => Promise<IBankAccount | null>,
    code?: string,
  ) => {
    const { mandateId } = this.state;
    const match: any = this.props.match;
    const bankId = match && match.params && match.params.bankId;

    this.setState({
      modalVisible: false,
    });
    if (code && mandateId && sign) {
      const result = await sign(mandateId, code);
      if (refetch) {
        await refetch();
      }
      if (result) {
        history.push(`/company/bank/mandate/view/${bankId}`);
      }
    } else {
      if (refetch) {
        await refetch();
      }
    }
  };

  render() {
    const { user, intl, form } = this.props;
    const { modalVisible, mandateId } = this.state;
    const match: any = this.props.match;
    const bankId = match && match.params && match.params.bankId;
    const id = match && match.params && match.params.id;
    const me: IUser = user && user.data && user.data.me;
    const currentCompany: ICompany = me && me.currentCompany;

    return (
      <Content>
        <Row type="flex">
          <Heading
            icon={IconValue.Wallet}
            title={'bank.mandate_add.title'}
            description={
              top.location.href.indexOf('?bank') > -1
                ? 'bank.mandate_add.save_and_description'
                : 'bank.mandate_add.description'
            }
          />
        </Row>
        {currentCompany && (
          <BankCtx.Provider id={bankId}>
            <BankCtx.Consumer>
              {({ bank }) => {
                const createMandate = bank && bank.createMandate;
                const generateCode = bank && bank.generateCode;
                const sign = bank && bank.sign;

                const current =
                  bank && bank.bankAccount && bank.bankAccount.bankAccount;
                const refetch =
                  bank && bank.bankAccount && bank.bankAccount.refetch;

                return (
                  <>
                    {modalVisible && (
                      <DialogCode
                        title="dialog.code.mandate_title"
                        description="dialog.code.mandate_description"
                        onComplete={this.close.bind(
                          null,
                          sign,
                          bank && bank.bankAccount && bank.bankAccount.refetch,
                        )}
                        id={mandateId}
                        generateCode={generateCode}
                        onCancel={this.close.bind(
                          null,
                          undefined,
                          bank && bank.bankAccount && bank.bankAccount.refetch,
                        )}
                        visible={modalVisible}
                      />
                    )}
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
                      <Form
                        className="form-mandate"
                        onSubmit={this.submit.bind(null, bankId, createMandate)}
                      >
                        <Row gutter={28}>
                          <Col span={8}>
                            <Text
                              disabled
                              id="name"
                              defaultValue={
                                currentCompany.name || currentCompany.brandName
                              }
                              label={
                                <FormattedMessage id="bank.mandate.name" />
                              }
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
                              label={
                                <FormattedMessage id="bank.mandate.address1" />
                              }
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
                              label={
                                <FormattedMessage id="bank.mandate.city" />
                              }
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
                              label={
                                <FormattedMessage id="bank.mandate.zipcode" />
                              }
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
                              label={
                                <FormattedMessage id="bank.mandate.country" />
                              }
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
                              defaultValue={
                                current && current.iban && current.iban.iban
                              }
                              disabled
                              label={
                                <FormattedMessage id="bank.mandate.iban" />
                              }
                              form={form}
                            />
                          </Col>
                        </Row>
                        <Row gutter={28}>
                          <Col span={8}>
                            <Text
                              id="bic"
                              defaultValue={
                                current && current.iban && current.iban.bic
                              }
                              disabled
                              label={<FormattedMessage id="bank.mandate.bic" />}
                              form={form}
                            />
                          </Col>
                          <Col span={8}>
                            <Text
                              id="bankName"
                              disabled
                              defaultValue={
                                current && current.iban && current.iban.bank
                              }
                              label={
                                <FormattedMessage id="bank.mandate.bank_name" />
                              }
                              form={form}
                            />
                          </Col>
                        </Row>
                      </Form>
                      <Link to="/company/informations">
                        <A>
                          <FormattedMessage id="bank.mandate.link_edit" />
                        </A>
                      </Link>
                    </Card>
                    <FloatingActionFooter
                      style={{
                        justifyContent: 'flex-end',
                      }}
                      visible={true}
                    >
                      <Button
                        onClick={this.later}
                        style={{
                          marginRight: 50,
                        }}
                        type={BtnType.Default}
                      >
                        <FormattedMessage id="bank.mandate.later" />
                      </Button>
                      <Button
                        onClick={this.submit.bind(null, bankId, createMandate)}
                        style={{ marginRight: 50 }}
                        type={BtnType.Primary}
                      >
                        <FormattedMessage id="bank.mandate.submit" />
                      </Button>
                    </FloatingActionFooter>
                  </>
                );
              }}
            </BankCtx.Consumer>
          </BankCtx.Provider>
        )}
      </Content>
    );
  }
}

export default compose(
  injectIntl,
  User.hoc(),
  Form.create({}),
)(MandateAdd);
