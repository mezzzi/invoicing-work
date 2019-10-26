import { Badge, Popover, Tag } from 'antd';
import { Icon } from 'components/Assets';
import { IconValue } from 'components/Assets/Icon';
import { BtnType, Button, InvoiceActions } from 'components/Button';
import { TableImport } from 'components/Table';
import * as BalanceCtx from 'context/Balance';
import { IInvoice, InvoiceStatus } from 'context/Invoice/types';
import { IInvoices } from 'context/Invoices/types';
import { ITransactions } from 'context/Transactions/types';
import * as React from 'react';
import {
  FormattedMessage,
  FormattedNumber,
  InjectedIntlProps,
  injectIntl,
} from 'react-intl';
import { Link } from 'react-router-dom';
import { toPickerDate } from 'utils/common';
import './List.module.less';

interface IProps extends InjectedIntlProps {
  invoices?: IInvoices | ITransactions;
  empty?: React.ReactNode;
  selectable?: boolean;
  className?: string;
  headers: any[];
  loading?: boolean;
  invoicesLoadings?: string[];
  onClickRow?: (invoice: IInvoice) => void;
  onCtaClick?: (invoice: IInvoice) => void;
  onSelectRows?: (invoices: IInvoice[]) => void;
  selectedId?: string;
}

interface IState {
  limit?: number;
  offset?: number;
  polling: boolean;
  modalIban: boolean;
}

class PurcharseList extends React.PureComponent<IProps, IState> {
  static defaultProps = {
    selectable: false,
  };

  state = {
    limit: 8,
    modalIban: false,
    offset: 0,
    polling: false,
  };

  handleRowClick: (invoice: IInvoice) => void;
  handleCtaClick: (invoice: IInvoice, e: React.FormEvent<Element>) => void;
  handleLoadInvoices: (current?: number, pageSize?: number) => void;
  constructor(props: any) {
    super(props);

    this.handleRowClick = this.rowClick.bind(this);
    this.handleLoadInvoices = this.loadInvoices.bind(this);
    this.handleCtaClick = this.ctaClick.bind(this);
  }

  ctaClick(invoice: IInvoice, e: React.FormEvent<Element>) {
    e.stopPropagation();
    this.props.onCtaClick && this.props.onCtaClick(invoice);
  }

  rowClick(invoice: IInvoice) {
    this.props.onClickRow && this.props.onClickRow(invoice);
  }

  loadInvoices(current?: number, pageSize?: number) {
    const offset =
      pageSize && current ? current * pageSize - pageSize : undefined;

    this.setState({
      limit: pageSize,
      offset,
    });
  }

  header(header: any) {
    const { intl } = this.props;
    return {
      className: `td-${header.key}${
        header.marge === false ? ' td-no-padding' : ''
      }`,
      dataIndex: header.key,
      key: header.key,
      title:
        header.title !== undefined
          ? header.title
          : intl.formatMessage({
              id: `purchase.table.${header.key}`,
            }),
      width: header.width,
    };
  }

  renderHeaders(): any {
    const { intl, headers, invoicesLoadings } = this.props;

    return (
      headers &&
      headers.map(header => {
        switch (header.key) {
          case 'concatened':
            return {
              ...this.header(header),
              render: (value: any, row: any, index: any) => {
                const contatenedValue = `${
                  row.number ? `${row.number}${row.dueDate ? ' / ' : ''}` : ''
                }${
                  row.dueDate
                    ? toPickerDate(row.dueDate).format('DD/MM/YYYY')
                    : ''
                }`;
                return contatenedValue || '';
              },
            };
          case 'companyEmitter':
            return {
              ...this.header(header),
              render: (value: any, row: any, index: any) => {
                if (value && (value.name || value.brandName)) {
                  return value.name || value.brandName;
                } else if (row.ocrSirenFeedback && row.ocrSirenFeedback) {
                  return (
                    row.ocrSirenFeedback.name || row.ocrSirenFeedback.brandName
                  );
                }
              },
            };
          case 'transactionType':
            return {
              ...this.header({
                ...header,
                title: null,
                width: 50,
              }),
              render: (value: any, row: any, index: any) => {
                return (
                  <BalanceCtx.Consumer>
                    {({ balance }) => {
                      const walletId =
                        balance &&
                        balance.data.balance &&
                        balance.data.balance.walletId;
                      let color = 'table-color';
                      let icon = IconValue.Change;
                      if (walletId === row.walletCreditId) {
                        color = 'table-color-payin';
                        icon = IconValue.ArrowUp;
                      } else if (walletId === row.walletDebitId) {
                        color = 'table-color-payout';
                        icon = IconValue.ArrowDown;
                      }
                      return <Icon className={color} value={icon} />;
                    }}
                  </BalanceCtx.Consumer>
                );
              },
            };
          case 'chevron':
            return {
              ...this.header({
                ...header,
                title: null,
              }),
              render: (value: any, row: any, index: any) => {
                return <Icon value={IconValue.ChevronRight} />;
              },
            };
          case 'actions':
            return {
              ...this.header({
                ...header,
                marge: false,
                title: null,
                width: 20,
              }),
              render: (value: any, row: any, index: any) => {
                return (
                  <InvoiceActions
                    actions={header.actions}
                    invoice={row as IInvoice}
                  />
                );
              },
            };
          case 'companyReceiver':
            return {
              ...this.header(header),
              render: (value: any, row: any, index: any) => {
                if (value && (value.name || value.brandName)) {
                  return value.name || value.brandName;
                }
                return '';
              },
            };
          case 'importAt':
            return {
              ...this.header(header),
              render: (value: any, row: any, index: any) => {
                return value && toPickerDate(value).format('DD/MM/YYYY');
              },
            };
          case 'createdDate':
            return {
              ...this.header(header),
              render: (value: any, row: any, index: any) => {
                return value && toPickerDate(value).format('DD/MM/YYYY');
              },
            };
          case 'dueDate':
            return {
              ...this.header(header),
              render: (value: any, row: any, index: any) => {
                return value && toPickerDate(value).format('DD/MM/YYYY');
              },
            };
          case 'totalWoT':
            return {
              ...this.header(header),
              render: (value: any, row: any, index: any) => {
                return (
                  <FormattedNumber
                    style="currency"
                    currency={row.currency}
                    value={value}
                  />
                );
              },
            };
          case 'total':
            return {
              ...this.header(header),
              render: (value: any, row: any, index: any) => {
                return (
                  <FormattedNumber
                    style="currency"
                    currency={row.currency}
                    value={value}
                  />
                );
              },
            };
          case 'amount':
            return {
              ...this.header(header),
              render: (value: any, row: any, index: any) => {
                return (
                  <BalanceCtx.Consumer>
                    {({ balance }) => {
                      const walletId = balance && balance.data.balance.walletId;
                      let color;
                      if (walletId === row.walletCreditId) {
                        color = 'payin';
                      } else if (walletId === row.walletDebitId) {
                        color = 'payout';
                      }
                      return (
                        <span className={`table-color-${color}`}>
                          <FormattedNumber
                            style="currency"
                            currency={row.currency}
                            value={value}
                          />
                        </span>
                      );
                    }}
                  </BalanceCtx.Consumer>
                );
              },
            };
          case 'walletDebitId':
            return {
              ...this.header(header),
              render: (value: any, row: any, index: any) => {
                return (
                  <BalanceCtx.Consumer>
                    {({ balance }) => {
                      const walletId = balance && balance.data.balance.walletId;
                      if (walletId === value) {
                        return intl.formatMessage({
                          id: `balance.table.my_libeo_account`,
                        });
                      } else {
                        return value;
                      }
                    }}
                  </BalanceCtx.Consumer>
                );
              },
            };
          case 'walletCreditId':
            return {
              ...this.header(header),
              render: (value: any, row: any, index: any) => {
                return (
                  <BalanceCtx.Consumer>
                    {({ balance }) => {
                      const walletId = balance && balance.data.balance.walletId;
                      if (walletId === value) {
                        return intl.formatMessage({
                          id: `balance.table.my_libeo_account`,
                        });
                      } else {
                        return value;
                      }
                    }}
                  </BalanceCtx.Consumer>
                );
              },
            };
          case 'error':
            return {
              ...this.header(header),
              render: (value: any, row: any, index: any) => {
                return (
                  <Badge
                    status={value ? 'error' : 'success'}
                    className={`status-${row.status.toLowerCase()}`}
                  />
                );
              },
            };
          case 'estimatedBalance':
            return {
              ...this.header({
                ...header,
                title: null,
                width: 20,
              }),
              render: (value: any, row: any, index: any) => {
                if (row.estimatedBalance < 0) {
                  return (
                    <Popover
                      placement="bottom"
                      content={intl.formatMessage({
                        id: 'purchase.table.warning',
                      })}
                    >
                      <Icon className="warning" value={IconValue.Warning} />
                    </Popover>
                  );
                }
                return null;
              },
            };
          case 'status':
            return {
              ...this.header({
                ...header,
                marge: false,
              }),
              render: (value: any, row: any, index: any) => {
                const lowerValue = value.toLowerCase();
                let color: string = '';
                if (value === InvoiceStatus.Planned) {
                  color = 'disabled';
                }
                if (value === InvoiceStatus.Paid) {
                  color = 'success';
                }
                return {
                  children: (
                    <Tag className={`ant-tag-${color}`}>
                      {intl.formatMessage({
                        id: `purchase.table.status_${lowerValue}`,
                      })}
                    </Tag>
                  ),
                };
              },
            };
          case 'cta':
            return {
              ...this.header({
                ...header,
                marge: false,
              }),
              render: (value: any, row: any, index: any) => {
                let Btn;
                const btnLoading =
                  invoicesLoadings && invoicesLoadings.indexOf(row.id) > -1;

                switch (row.status) {
                  case InvoiceStatus.ToPay:
                    Btn = (
                      <Button
                        loading={btnLoading}
                        onClick={this.handleCtaClick.bind(null, row)}
                        type={BtnType.Primary}
                        className="btn-invoice-to-pay"
                      >
                        <FormattedMessage id="invoice.status.to_pay" />
                      </Button>
                    );
                    break;
                  case InvoiceStatus.Planned:
                    Btn = (
                      <Button
                        loading={btnLoading}
                        onClick={this.handleCtaClick.bind(null, row)}
                        type={BtnType.Default}
                        className="btn-invoice-planned"
                      >
                        <FormattedMessage id="invoice.status.planned" />
                      </Button>
                    );
                    break;
                  case InvoiceStatus.Scanned:
                    Btn = (
                      <Link to={`/invoice/draft/${row.id}`}>
                        <Button
                          loading={btnLoading}
                          type={BtnType.Primary}
                          className="btn-invoice-scanned"
                        >
                          <FormattedMessage id="invoice.status.scanned" />
                        </Button>
                      </Link>
                    );
                    break;
                  case InvoiceStatus.Scanning:
                    Btn = (
                      <Button disabled loading className="btn-invoice-loading">
                        <FormattedMessage id="invoice.status.scanning" />
                      </Button>
                    );
                    break;
                  case InvoiceStatus.Paid:
                    Btn = null;
                    break;
                  default:
                    Btn = (
                      <Button disabled loading className="btn-invoice-loading">
                        <FormattedMessage id="invoice.status.upload" />
                      </Button>
                    );
                    break;
                }
                return {
                  children: Btn,
                };
              },
              title: null,
            };
          default:
            return this.header(header);
        }
      })
    );
  }

  render() {
    const {
      selectable,
      invoices,
      onSelectRows,
      selectedId,
      empty,
    } = this.props;

    return invoices && invoices.rows ? (
      <TableImport
        empty={empty}
        selectedId={selectedId}
        onSelectRows={onSelectRows}
        selectable={selectable}
        onClickRow={this.handleRowClick}
        onChangePage={this.handleLoadInvoices}
        dataSource={invoices.rows}
        columns={this.renderHeaders()}
      />
    ) : null;
  }
}

export default injectIntl(PurcharseList);
