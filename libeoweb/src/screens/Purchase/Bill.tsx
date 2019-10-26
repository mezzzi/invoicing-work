import { Col, Row } from 'antd';
import { BtnType, Button } from 'components/Button';
import 'components/Dialog/Styles.module.less';
import Infinity from 'components/Infinity';
import { Content, RightSideBar } from 'components/Layout';
import { Empty, List } from 'components/Table';
import { Heading } from 'components/Typo';
import * as Alert from 'context/Alert';
import * as Balance from 'context/Balance';
import {
  ICompany,
  ICompanyProvisionningStrategies,
  IKycStatus,
} from 'context/Company/types.d';
import * as Invoice from 'context/Invoice';
import { IInvoice, InvoiceStatus } from 'context/Invoice/types';
import * as Upload from 'context/Upload';
import * as User from 'context/User';
import moment, { Moment } from 'moment';
import * as React from 'react';
import { compose } from 'react-apollo';
import { FormattedMessage } from 'react-intl';
import history from 'store/history';
import Detail from './Detail';
import Dialogs, { dialogsType } from './Dialogs';
import SelectContact from './SelectContact';

interface IProps
  extends Upload.InjectedProps,
    User.InjectedProps,
    Alert.InjectedProps,
    Balance.InjectedProps {
  selectedInvoice?: IInvoice;
  onSelectDate?: (date?: Moment) => Promise<void>;
  onChangeStatus?: () => Promise<void>;
  remove?: (invoices: IInvoice[], message?: string) => void;
  updateStatus?: (
    id: string,
    status: InvoiceStatus,
    message: string,
  ) => Promise<IInvoice | undefined>;
  payout?: (
    invoiceId: string,
    date?: Date,
    code?: string,
  ) => Promise<IInvoice | undefined>;
  payoutContacts?: (invoiceId: string, contactsIds?: string[]) => void;
  checkBalance?: (id: string, paymentAt: Date) => Promise<boolean>;
  generateCode?: (id: string) => void;
  invoices?: IInvoice[];
  more?: (total: number, length: number) => Promise<void>;
  hasMore: boolean;
  length: number;
  total: number;
}

interface IState {
  dialog?: React.ReactNode;
  sidebar?: React.ReactNode;
  selectedInvoiceId?: string;
  selectedInvoice?: IInvoice;
  toPayInvoice?: IInvoice;
  invoicesLoadings: string[];
}

class PurchaseBill extends React.PureComponent<IProps, IState> {
  state = {
    dialog: undefined,
    invoicesLoadings: [],
    selectedInvoice: undefined,
    selectedInvoiceId: undefined,
    toPayInvoice: undefined,
  };

  actions: any[] = [];
  constructor(props: IProps) {
    super(props);

    this.actions = [
      {
        handle: this.handleAction,
        type: 'control',
      },
      {
        handle: this.handleAction,
        type: 'download',
      },
      {
        handle: this.handleAction,
        type: 'delete',
      },
      {
        handle: this.handleAction,
        type: 'pay-now',
      },
      {
        handle: this.handleAction,
        type: 'pay-later',
      },
    ];
  }

  onPayoutContacts = async (invoice: IInvoice, contactsIds?: string[]) => {
    const { payoutContacts } = this.props;
    if (invoice && payoutContacts) {
      await payoutContacts(invoice.id, contactsIds);
    }
    this.setState({
      toPayInvoice: undefined,
    });
  };

  handleAction = async (
    type: string,
    invoice: IInvoice,
    date: Moment,
    code?: string,
  ): Promise<void> => {
    this.setState(
      {
        dialog: undefined,
        // selectedInvoiceId: undefined,
      },
      async () => {
        if (invoice && invoice.id) {
          switch (type) {
            case 'control':
              if (invoice.status !== InvoiceStatus.Scanned) {
                await this.updateStatus(invoice.id, InvoiceStatus.Scanned);
                history.push(`/invoice/draft/${invoice.id}`);
              }
              break;
            case 'delete':
              await this.remove([invoice]);
              break;
            case 'pay':
              const status = await this.checkStatus(invoice, date);
              if (status) {
                await this.pay(type, invoice, date, code);
              }
              break;
            case 'transfert':
              await this.pay(type, invoice, date, code);
              break;
            case 'fund':
              await this.pay(type, invoice, date, code);
              break;
            case 'waiting':
              await this.pay(type, invoice, date, code);
              break;
            case 'refused':
              await this.pay(type, invoice, date, code);
              break;
            case 'code':
              await this.pay(type, invoice, date, code);
              break;
          }
        }
      },
    );
  };

  showModal = (
    type: string,
    invoice: IInvoice,
    date: Moment,
    code?: string,
  ) => {
    const { generateCode } = this.props;
    let handle = this.handleAction.bind(null, type, invoice, date, code);
    if (type === 'code') {
      handle = this.handleAction.bind(null, type, invoice, date);
    }

    this.setState({
      dialog: (
        <Dialogs
          invoiceId={invoice.id}
          onClose={handle}
          generateCode={generateCode}
          modalVisible={type as any}
        />
      ),
    });
  };

  checkBalance = async (id: string, date: Date): Promise<boolean> => {
    if (this.props.checkBalance) {
      return await this.props.checkBalance(id, date);
    }
    return false;
  };

  updateStatus = async (id: string, status: InvoiceStatus) => {
    if (this.props.updateStatus) {
      await this.props.updateStatus(
        id,
        status,
        'invoice.status.cancel_success',
      );
    }
  };

  remove = async (invoices: IInvoice[]) => {
    if (this.props.remove) {
      await this.props.remove(invoices, 'invoice.actions.delete');
    }
  };

  ctaClick = (invoice: IInvoice) => {
    if (invoice.status === InvoiceStatus.Planned) {
      this.cancelPay(invoice);
    } else if (invoice.status === InvoiceStatus.ToPay) {
      this.handleAction('pay', invoice, moment(invoice.dueDate));
    }
  };

  checkStatus = async (
    invoice: IInvoice,
    date: Moment,
  ): Promise<boolean | undefined> => {
    const { user } = this.props;
    const currentCompany: ICompany =
      user && user.data && user.data.me && user.data.me.currentCompany;

    let canPay = false;
    let dialog: dialogsType | undefined;

    // I don't have a company
    if (!currentCompany || !currentCompany.kycStep) {
      dialog = 'start';
      // My kyc isn't validated (kycStatus = null)
    } else if (!currentCompany || !currentCompany.kycStatus) {
      if (currentCompany.kycStep !== 'IBAN') {
        // kycStep not IBAN
        dialog = 'onboarding';
      } else {
        // kycStep iban (need first fun to start kyc review)
        dialog = 'fund';
      }
      // My kyc is pending (treezor validation)
    } else if (currentCompany.kycStatus === IKycStatus.PENDING) {
      dialog = 'waiting';
      // My kyc is refused (by treezor)
    } else if (currentCompany.kycStatus === IKycStatus.REFUSED) {
      dialog = 'refused';
      // Invoice need confirmation code price greater than 2000
    } else if (invoice && invoice.total > 2000) {
      dialog = 'code';
    } else {
      canPay = true;
    }

    if (dialog) {
      this.showModal(dialog, invoice, date);
    }

    return canPay;
  };

  pay = async (
    type: string,
    invoice: IInvoice,
    date: Moment,
    code?: string,
  ) => {
    const { user } = this.props;
    const currentCompany: ICompany =
      user && user.data && user.data.me && user.data.me.currentCompany;

    if (type !== 'code' && type !== 'transfert' && type !== 'refused') {
      const balance = await this.checkBalance(invoice.id, date.toDate());
      // if user doesn't have enough balance and selected toup provisionning strategy
      if (
        !balance &&
        currentCompany.provisionningStrategy !==
          ICompanyProvisionningStrategies.autoload
      ) {
        return this.showModal('transfert', invoice, date, code);
      }
    }

    if (invoice.total > 2000 && !code) {
      if (type === 'code') {
        return this.setState({
          // discard
          dialog: undefined,
        });
      }
      return this.showModal('code', invoice, date, code);
    }

    if (this.props.payout) {
      const payout = this.props.payout;
      await new Promise(resolve =>
        this.setState(
          {
            invoicesLoadings: [...this.state.invoicesLoadings, invoice.id],
          },
          resolve,
        ),
      );
      const paid = await payout(invoice.id, date.toDate(), code);
      if (paid) {
        this.setState({
          invoicesLoadings: this.state.invoicesLoadings.filter(
            id => id !== invoice.id,
          ),
          toPayInvoice: paid,
        });
      } else {
        this.setState({
          invoicesLoadings: this.state.invoicesLoadings.filter(
            id => id !== invoice.id,
          ),
        });
      }
    }
  };

  cancelPay = async (invoice: IInvoice) => {
    if (invoice.status === InvoiceStatus.Planned && this.props.updateStatus) {
      const updateStatus = this.props.updateStatus;
      await new Promise(resolve =>
        this.setState(
          {
            invoicesLoadings: [...this.state.invoicesLoadings, invoice.id],
          },
          resolve,
        ),
      );
      await updateStatus(
        invoice.id,
        InvoiceStatus.ToPay,
        'invoice.status.cancel_success',
      );
      this.setState({
        invoicesLoadings: this.state.invoicesLoadings.filter(
          id => id !== invoice.id,
        ),
      });
    }
  };

  selectInvoice = async (invoice: IInvoice) => {
    this.setState({
      selectedInvoice: invoice,
      selectedInvoiceId: invoice.id,
      toPayInvoice: undefined,
    });
  };

  onCloseSelectedInvoice = async () => {
    this.setState({
      selectedInvoice: undefined,
      selectedInvoiceId: undefined,
    });
  };

  onCloseContacts = async () => {
    this.setState({
      toPayInvoice: undefined,
    });
  };

  upload = () => {
    const { upload } = this.props;
    const setVisibility = upload && upload.setVisibility;
    if (setVisibility) {
      setVisibility(true);
    }
  };

  render() {
    const { invoices, more, hasMore, length, total } = this.props;
    const {
      dialog,
      selectedInvoice,
      selectedInvoiceId,
      toPayInvoice,
    } = this.state;
    const invoicesLoadings: string[] = this.state.invoicesLoadings;

    let sidebar;
    let onClose;
    if (toPayInvoice) {
      onClose = this.onCloseContacts;
      sidebar = toPayInvoice && (
        <SelectContact
          onSubmit={this.onPayoutContacts}
          invoice={toPayInvoice}
        />
      );
    } else if (selectedInvoiceId) {
      onClose = this.onCloseSelectedInvoice;
      sidebar = (
        <Invoice.Provider id={selectedInvoiceId}>
          <Invoice.Consumer>
            {props => {
              const detail: IInvoice =
                (props.invoice &&
                  props.invoice.data &&
                  props.invoice.data.invoice) ||
                selectedInvoice;
              const btnLoading = detail
                ? invoicesLoadings.indexOf(detail.id) > -1
                : false;

              return (
                <Detail
                  btnLoading={btnLoading}
                  onCtaClick={this.ctaClick}
                  actions={this.actions}
                  invoice={detail}
                />
              );
            }}
          </Invoice.Consumer>
        </Invoice.Provider>
      );
    }

    return (
      <RightSideBar closable onClose={onClose} sidebar={sidebar}>
        <Infinity
          hasMore={hasMore}
          loadMore={more && more.bind(null, total, length)}
        >
          <Content>
            {dialog}
            <Row type="flex">
              <Heading
                button="dashboard.header.upload_btn"
                onClick={this.upload}
                title="purchase.control.bills_title"
                description={
                  total > 0
                    ? 'purchase.control.bills_number_of_import_to_control'
                    : undefined
                }
                descriptionVariables={{
                  count: total,
                }}
              />
            </Row>
            <Row>
              <Col>
                <List
                  invoicesLoadings={invoicesLoadings}
                  empty={
                    <Empty>
                      <Button type={BtnType.Primary} onClick={this.upload}>
                        <FormattedMessage id="purchase.control.upload_more" />
                      </Button>
                    </Empty>
                  }
                  selectedId={selectedInvoiceId}
                  onCtaClick={this.ctaClick}
                  invoices={
                    invoices
                      ? {
                          rows: invoices,
                          total,
                        }
                      : undefined
                  }
                  className={!sidebar ? 'list-large' : 'list-small'}
                  onClickRow={this.selectInvoice}
                  selectable
                  headers={
                    !sidebar
                      ? [
                          { key: 'number' },
                          { key: 'receiverTitle' },
                          { key: 'dueDate' },
                          { key: 'companyEmitter' },
                          { key: 'total' },
                          { key: 'status' },
                          { key: 'estimatedBalance' },
                          { key: 'cta' },
                          {
                            actions: this.actions,
                            key: 'actions',
                          },
                        ]
                      : [
                          { key: 'number' },
                          { key: 'dueDate' },
                          { key: 'companyEmitter' },
                          { key: 'total' },
                          { key: 'status' },
                          { key: 'estimatedBalance' },
                        ]
                  }
                />
              </Col>
            </Row>
          </Content>
        </Infinity>
      </RightSideBar>
    );
  }
}

export default compose(
  Upload.hoc(),
  User.hoc(),
  Balance.hoc(),
  Alert.hoc(),
)(PurchaseBill);
