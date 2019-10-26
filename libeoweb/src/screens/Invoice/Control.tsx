import { Col, Row } from 'antd';
import { Form } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import ApolloClient from 'apollo-client';
import { Icon } from 'components/Assets';
import { IconValue } from 'components/Assets/Icon';
import { BtnType, Button } from 'components/Button';
import { Date, Select, SelectOption, Text } from 'components/Form';
import ControlIban from 'components/Form/ControlIban';
import { Viewer } from 'components/Invoice';
import { Content, FloatingActionFooter } from 'components/Layout';
import { Div, H2 } from 'components/Typo';
import { IInputAddress } from 'context/Addresses/types';
import { IInputCompany } from 'context/Company/types.d';
import * as Iban from 'context/Iban';
import { IbanStatus, IIban } from 'context/Iban/types';
import * as Invoice from 'context/Invoice';
import {
  IInvoice,
  InvoiceStatus,
  IUpdateInvoiceInput,
} from 'context/Invoice/types';
import * as Invoices from 'context/Invoices';
import * as Partner from 'context/Partner';
import * as Upload from 'context/Upload';
import * as React from 'react';
import { compose, withApollo } from 'react-apollo';
import { FormattedMessage, InjectedIntlProps, injectIntl } from 'react-intl';
import { Redirect } from 'react-router';
import history from 'store/history';
import { isIban, staticAssets, toPickerDate, toServerDate } from 'utils/common';
import currencies from 'utils/currencies';
import ControlAccounting from './ControlAccounting';
import ControlPartner from './ControlPartner';

interface IProps
  extends FormComponentProps,
    Upload.InjectedProps,
    Iban.InjectedProps,
    InjectedIntlProps {
  id: string;
  client: ApolloClient<any>;
}

interface IState {
  ibanStatus?: IbanStatus;
  tmpPartner?: IInputCompany;
  devises: any;
  ibanStatusError: boolean;
}

class PurcharseControl extends React.PureComponent<IProps, IState> {
  state = {
    devises: {},
    ibanStatus: undefined,
    ibanStatusError: false,
    tmpPartner: undefined,
  };

  handleSubmit: (
    id: string,
    createPartner: any,
    updateInvoice: any,
    invoice: IInvoice,
    next?: IInvoice,
    refetch?: () => void,
    e?: React.FormEvent,
  ) => void;
  // handleOnChangeIban: (node: React.ChangeEvent) => void;
  handleOnChangePartner: (tmpPartner?: IInputCompany) => void;
  handleDelete: (remove?: (id: string) => void) => void;
  handleLater: (
    id: string,
    createPartner: any,
    updateInvoice: any,
    invoice: IInvoice,
    e: React.FormEvent,
  ) => void;

  constructor(props: any) {
    super(props);

    this.handleLater = this.later.bind(this);
    this.handleOnChangePartner = this.ChangePartner.bind(this);
    this.handleDelete = this.delete.bind(this);
    this.handleSubmit = this.submit.bind(this);
  }

  ChangePartner(tmpPartner?: IInputCompany) {
    this.setState({ tmpPartner });
  }

  getPartner() {
    const tmpPartner: any = this.state.tmpPartner;
    if (tmpPartner) {
      const addressesFound =
        (tmpPartner && tmpPartner.addresses && tmpPartner.addresses.rows) ||
        (tmpPartner && tmpPartner.addresses && tmpPartner.addresses);

      const addresses: IInputAddress[] =
        addressesFound &&
        addressesFound.map((address: IInputAddress) => {
          return {
            address1: address.address1,
            address2: address.address2,
            city: address.city,
            country: address.country,
            siret: address.siret,
            zipcode: parseFloat(`${address.zipcode}`),
          };
        });
      tmpPartner.addresses = addresses;
      delete tmpPartner.id;
      delete tmpPartner.source;
      delete tmpPartner.createdAt;
      delete tmpPartner.updatedAt;
      delete tmpPartner.status;
      delete tmpPartner.__typename;
      delete tmpPartner.contacts;
      delete tmpPartner.phone;
      delete tmpPartner.treezorEmail;
      delete tmpPartner.treezorUserId;
      delete tmpPartner.treezorWalletId;
      delete tmpPartner.treezorIban;
      delete tmpPartner.treezorBic;
      delete tmpPartner.kycStatus;
      delete tmpPartner.ibans;
    }
    return tmpPartner;
  }

  getIban(ibans: IIban[], value: string) {
    return ibans && ibans.find(iban => value === iban.iban);
  }

  submit = async (
    id: string,
    createPartner: any,
    updateInvoice: any,
    invoice: IInvoice,
    next?: IInvoice,
    refetch?: () => void,
    e?: React.FormEvent,
  ) => {
    const { intl } = this.props;
    this.props.form.validateFields(async (err, values) => {
      if (!isIban(values.iban)) {
        this.props.form.setFields({
          iban: {
            errors: [
              new Error(
                intl.formatMessage({
                  id: 'common.control.iban_error',
                }),
              ),
            ],
            value: values.iban,
          },
        });
        return;
      }

      if (!err) {
        const tmpPartner = this.getPartner();
        const results = await createPartner(tmpPartner);

        values.total = parseFloat(values.total);
        values.totalWoT = parseFloat(values.totalWoT);
        values.invoiceDate = toServerDate(values.invoiceDate);
        values.dueDate = toServerDate(values.dueDate);
        values.companyEmitter = tmpPartner || results.data.createPartner;

        await updateInvoice(id, values, 'purchase.control.save_success');
        if (refetch) {
          refetch();
        }
        if (next) {
          history.push(`/invoice/draft/${next.id}`);
        } else {
          history.push('/purchase/bills');
        }
      }
    });
  };

  later = async (
    id: string,
    createPartner: any,
    updateInvoice: any,
    invoice: IInvoice,
    e: React.FormEvent,
  ) => {
    const fieldNames = [
      'invoiceDate',
      'dueDate',
      'totalWoT',
      'total',
      'currency',
      'number',
      'receiverTitle',
      'iban',
      'purchaseAccount',
    ];
    const values: any = this.props.form.getFieldsValue(
      fieldNames,
    ) as IUpdateInvoiceInput;
    const partner = this.getPartner();
    values.total = parseFloat(values.total);
    values.totalWoT = parseFloat(values.totalWoT);
    values.invoiceDate = toServerDate(values.invoiceDate);
    values.dueDate = toServerDate(values.dueDate);
    values.companyEmitter = null;
    values.ocrSirenFeedback = partner;
    values.ocrFeedback = {
      ...invoice.ocrFeedback,
      iban: values.iban === '' ? undefined : values.iban,
    };
    values.iban = null;

    await updateInvoice(id, values);
    history.push('/purchase/draft');
  };

  delete = async (remove?: (id: string) => void) => {
    remove && (await remove(this.props.id));
    history.push('/purchase/draft');
  };

  async componentDidMount() {
    const devises = await currencies.all();
    this.setState({ devises });
  }

  render() {
    const { form, intl } = this.props;
    const { devises } = this.state;
    const tmpPartner: any = this.state.tmpPartner;
    const ibanStatus: IbanStatus | undefined = this.state.ibanStatus;

    return (
      <Invoices.Provider
        offset={0}
        limit={2}
        filters={{
          enabled: true,
          status: [InvoiceStatus.Scanned],
        }}
      >
        <Invoices.Consumer>
          {data => {
            const dataInvoices = data.invoices && data.invoices.data;
            const invoices = dataInvoices && dataInvoices.invoices;
            const total = invoices && invoices.total;
            const rows = invoices && invoices.rows;

            return (
              <Invoice.Provider id={this.props.id}>
                <Invoice.Consumer>
                  {({ invoice }) => {
                    const item = invoice && invoice.data.invoice;
                    const next =
                      rows &&
                      item &&
                      rows.find((row: IInvoice) => row.id !== item.id);
                    const remove = invoice && invoice.delete;

                    if (item && item.status !== InvoiceStatus.Scanned) {
                      return <Redirect to={{ pathname: '/purchase/draft' }} />;
                    }

                    let defaultIban: string | undefined =
                      item && item.iban && item.iban.iban;
                    if (!defaultIban) {
                      defaultIban =
                        item && item.ocrFeedback && item.ocrFeedback.iban;
                    }

                    let siren;
                    if (tmpPartner && tmpPartner.siren) {
                      siren = tmpPartner.siren;
                    } else if (
                      item &&
                      item.ocrSirenFeedback &&
                      item.ocrSirenFeedback.siren
                    ) {
                      siren = item.ocrSirenFeedback.siren;
                    }

                    return (
                      <Content
                        footer={
                          <Partner.Provider limit={8} offset={0}>
                            <Partner.Consumer>
                              {({ partner }) => {
                                return (
                                  <FloatingActionFooter visible={true}>
                                    <Button
                                      onClick={this.handleDelete.bind(
                                        null,
                                        remove,
                                      )}
                                      style={{ marginLeft: 210 }}
                                      icon={<Icon value={IconValue.Trash} />}
                                      type={BtnType.Ghost}
                                      className="btn-control-delete-invoice"
                                    >
                                      <FormattedMessage id="purchase.footer.delete_invoice" />
                                    </Button>
                                    <div
                                      style={{
                                        display: 'flex',
                                        flex: 1,
                                        justifyContent: 'flex-end',
                                      }}
                                    >
                                      <Button
                                        onClick={
                                          item &&
                                          this.handleLater.bind(
                                            this,
                                            item.id,
                                            partner && partner.create,
                                            invoice && invoice.update,
                                            item,
                                          )
                                        }
                                        style={{ marginRight: 50 }}
                                        icon={
                                          <Icon value={IconValue.TimeReverse} />
                                        }
                                        type={BtnType.Ghost}
                                        className="btn-control-later"
                                      >
                                        <FormattedMessage id="purchase.footer.do_it_later" />
                                      </Button>
                                    </div>
                                    <Button
                                      onClick={
                                        item &&
                                        this.handleSubmit.bind(
                                          this,
                                          item.id,
                                          partner && partner.create,
                                          invoice && invoice.update,
                                          item,
                                          next,
                                          dataInvoices && dataInvoices.refetch,
                                        )
                                      }
                                      style={{ marginRight: 50 }}
                                      type={BtnType.Primary}
                                      className="btn-control-validate"
                                    >
                                      {next ? (
                                        <FormattedMessage id="purchase.footer.validate_next_invoice" />
                                      ) : (
                                        <FormattedMessage id="purchase.footer.validate_invoice" />
                                      )}
                                    </Button>
                                  </FloatingActionFooter>
                                );
                              }}
                            </Partner.Consumer>
                          </Partner.Provider>
                        }
                      >
                        {item && (
                          <>
                            <Row
                              type="flex"
                              style={{
                                flex: 1,
                                height: '100%',
                              }}
                            >
                              <Col
                                style={{
                                  height: '100%',
                                  marginRight: 70,
                                  maxWidth: '40%',
                                }}
                              >
                                <Viewer src={item.filepath} />
                              </Col>
                              <Col
                                style={{
                                  flex: 1,
                                  maxWidth: 1000,
                                }}
                              >
                                <Form className="form-bill-control">
                                  <Row gutter={28}>
                                    <Col span={24}>
                                      <H2>
                                        <FormattedMessage id="purchase.control.info_title" />
                                      </H2>
                                      <Div className="form-bill-validate">
                                        <FormattedMessage id="purchase.control.info_description" />
                                      </Div>
                                    </Col>
                                  </Row>
                                  <Row gutter={28}>
                                    <Col span={16}>
                                      <ControlPartner
                                        defaultPartner={
                                          item.companyEmitter ||
                                          item.ocrSirenFeedback
                                        }
                                        onChangePartner={
                                          this.handleOnChangePartner
                                        }
                                        form={form}
                                      />
                                    </Col>
                                  </Row>
                                  <Row gutter={28}>
                                    <Col span={8}>
                                      <Date
                                        defaultValue={
                                          item.invoiceDate
                                            ? toPickerDate(item.invoiceDate)
                                            : null
                                        }
                                        id="invoiceDate"
                                        label={
                                          <FormattedMessage id="purchase.control.billing_date" />
                                        }
                                        form={form}
                                      />
                                    </Col>
                                    <Col span={8}>
                                      <Date
                                        defaultValue={
                                          item.dueDate
                                            ? toPickerDate(item.dueDate)
                                            : null
                                        }
                                        id="dueDate"
                                        label={
                                          <FormattedMessage id="purchase.control.deadline_date" />
                                        }
                                        rules={[
                                          {
                                            message: intl.formatMessage({
                                              id:
                                                'purchase.control.deadline_date_error',
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
                                        defaultValue={item.totalWoT}
                                        id="totalWoT"
                                        label={
                                          <FormattedMessage id="purchase.control.amount_HT" />
                                        }
                                        rules={[
                                          {
                                            message: intl.formatMessage({
                                              id:
                                                'purchase.control.amount_HT_error',
                                            }),
                                            required: true,
                                          },
                                        ]}
                                        form={form}
                                      />
                                    </Col>
                                    <Col span={8}>
                                      <Text
                                        defaultValue={item.total}
                                        id="total"
                                        label={
                                          <FormattedMessage id="purchase.control.amount_TTC" />
                                        }
                                        rules={[
                                          {
                                            message: intl.formatMessage({
                                              id:
                                                'purchase.control.amount_TTC_error',
                                            }),
                                            required: true,
                                          },
                                        ]}
                                        form={form}
                                      />
                                    </Col>
                                    <Col span={6}>
                                      <Select
                                        defaultValue={item.currency}
                                        showSearch
                                        id="currency"
                                        label={
                                          <FormattedMessage id="purchase.control.currency" />
                                        }
                                        rules={[
                                          {
                                            message: intl.formatMessage({
                                              id:
                                                'purchase.control.currency_error',
                                            }),
                                            pattern: /^EUR$/,
                                            required: true,
                                          },
                                        ]}
                                        form={form}
                                        options={Object.keys(devises).map(
                                          (key: string, i: number) => {
                                            const devise: any = (devises as any)[
                                              key
                                            ];

                                            return (
                                              <SelectOption
                                                key={`${i}`}
                                                value={`${devise.code}`}
                                              >
                                                {devise.code}
                                              </SelectOption>
                                            );
                                          },
                                        )}
                                      />
                                    </Col>
                                  </Row>
                                  <Row gutter={28}>
                                    <Col span={8}>
                                      <Text
                                        defaultValue={item.number}
                                        id="number"
                                        label={
                                          <FormattedMessage id="purchase.control.billing_number" />
                                        }
                                        form={form}
                                      />
                                    </Col>
                                    <Col span={8}>
                                      <Text
                                        defaultValue={item.receiverTitle}
                                        id="receiverTitle"
                                        label={
                                          <FormattedMessage id="purchase.control.object" />
                                        }
                                        form={form}
                                      />
                                    </Col>
                                  </Row>
                                  <Row gutter={28}>
                                    <Col span={16}>
                                      <Iban.Provider siren={siren}>
                                        <ControlIban
                                          dropdown
                                          showNew
                                          siren={siren}
                                          value={defaultIban}
                                          form={form}
                                        />
                                      </Iban.Provider>
                                    </Col>
                                  </Row>
                                  <Row gutter={28}>
                                    <Col span={16}>
                                      <ControlAccounting
                                        form={form}
                                        purchaseAccountId={
                                          item.purchaseAccount &&
                                          item.purchaseAccount.id
                                        }
                                      />
                                    </Col>
                                  </Row>
                                </Form>
                              </Col>
                            </Row>
                          </>
                        )}
                      </Content>
                    );
                  }}
                </Invoice.Consumer>
              </Invoice.Provider>
            );
          }}
        </Invoices.Consumer>
      </Invoices.Provider>
    );
  }
}

export default compose(
  withApollo,
  Form.create({}),
  injectIntl,
)(PurcharseControl);
