import { Form, Popover } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import { Icon } from 'components/Assets';
import { IconValue } from 'components/Assets/Icon';
import { Date } from 'components/Form';
import { Div } from 'components/Typo';
import { IInvoice, InvoiceStatus, NInvoiceStatus } from 'context/Invoice/types';
import moment, { Moment } from 'moment';
import * as React from 'react';
import { compose } from 'react-apollo';
import { FormattedMessage, InjectedIntlProps, injectIntl } from 'react-intl';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { staticAssets } from 'utils/common';
import './InvoiceActions.module.less';

export type ActionHandlerType = (
  type: string,
  invoice: IInvoice,
  date: Moment,
) => void;

/**
 * @props
 */
interface IProps
  extends RouteComponentProps,
    InjectedIntlProps,
    FormComponentProps {
  actions: Array<{
    type: string;
    handle?: ActionHandlerType;
  }>;
  invoice: IInvoice;
}

/**
 * @state
 */
interface IState {
  open: boolean;
  picker: boolean;
}

class InvoiceActions extends React.PureComponent<IProps, IState> {
  state = {
    open: false,
    picker: false,
  };

  parentDatePicker = (): HTMLElement => {
    const parentDatePicker = document.querySelector('#parentDatePicker');
    return parentDatePicker ? (parentDatePicker as HTMLElement) : document.body;
  };

  selectDate = (
    type: string,
    handle?: (type: string, invoice: IInvoice, ...args: any[]) => void,
    date?: Moment,
  ) => {
    this.setState({
      open: false,
      picker: false,
    });
    this.click(type, handle, date);
  };

  stopPropagation = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
  };

  click = (
    type: string,
    handle?: (type: string, invoice: IInvoice, date: Moment) => void,
    date?: Moment,
    e?: React.MouseEvent<HTMLDivElement>,
  ) => {
    e && e.stopPropagation();
    handle && handle(type, this.props.invoice, date ? date : moment());
    this.visibility(false);
  };

  openPicker = (e: React.MouseEvent<HTMLDivElement>) => {
    e && e.stopPropagation();
    this.setState({
      picker: true,
    });
  };

  visibility = (visible: boolean) => {
    this.setState({
      open: visible,
      picker: false,
    });
  };

  render() {
    const { invoice, actions } = this.props;
    const { picker } = this.state;

    const content =
      actions &&
      actions.map(action => {
        switch (action.type) {
          case 'control':
            return (
              invoice &&
              invoice.status === InvoiceStatus.ToPay && (
                <Div
                  key="control"
                  onClick={
                    this.click.bind(
                      null,
                      'control',
                      action.handle,
                      moment(),
                    ) as any
                  }
                  className="popover-row"
                >
                  <Icon value={IconValue.Edit} />
                  <FormattedMessage id="actions.invoice.control" />
                </Div>
              )
            );
          case 'download':
            return (
              <a
                key="download"
                href={staticAssets(invoice.filepath)}
                download={invoice.filename}
                target="_blank"
              >
                <Div onClick={this.stopPropagation} className="popover-row">
                  <Icon value={IconValue.Download} />
                  <FormattedMessage id="actions.invoice.download" />
                </Div>
              </a>
            );
          case 'delete':
            return (
              invoice &&
              NInvoiceStatus[invoice.status] <=
                NInvoiceStatus[InvoiceStatus.ToPay] && (
                <Div
                  key="delete"
                  onClick={
                    this.click.bind(
                      null,
                      'delete',
                      action.handle,
                      moment(),
                    ) as any
                  }
                  className="popover-row"
                >
                  <Icon value={IconValue.Trash} />
                  <FormattedMessage id="actions.invoice.delete" />
                </Div>
              )
            );
          case 'pay-now':
            return (
              invoice &&
              invoice.status !== InvoiceStatus.Planned &&
              invoice.status !== InvoiceStatus.Paid && (
                <Div
                  key="pay-now"
                  onClick={
                    this.click.bind(null, 'pay', action.handle, moment()) as any
                  }
                  className="popover-row"
                >
                  <Icon value={IconValue.Wallet} />
                  <FormattedMessage id="actions.invoice.pay_now" />
                </Div>
              )
            );
          case 'pay-later':
            return (
              invoice &&
              invoice.status !== InvoiceStatus.Planned &&
              invoice.status !== InvoiceStatus.Paid && (
                <Div
                  key="pay-later"
                  onClick={this.openPicker}
                  className="popover-row"
                >
                  {picker && (
                    <div id="parentDatePicker">
                      <Date
                        onChangeDate={this.selectDate.bind(
                          null,
                          'pay',
                          action.handle,
                        )}
                        getCalendarContainer={this.parentDatePicker}
                        open={true}
                        id="invoiceDate"
                        label={
                          <FormattedMessage id="purchase.control.billing_date" />
                        }
                        form={this.props.form}
                      />
                    </div>
                  )}
                  <Icon value={IconValue.Wallet} />
                  <FormattedMessage id="actions.invoice.pay_later" />
                </Div>
              )
            );
        }
      });

    return (
      <Popover
        onVisibleChange={this.visibility}
        visible={this.state.open}
        overlayClassName="invoice-actions"
        content={content}
        trigger="click"
        placement="bottomLeft"
      >
        <div
          onClick={this.stopPropagation}
          className={`popover-invoice-icon${this.state.open ? ' open' : ''}`}
        >
          <Icon value={IconValue.Dots3} />
        </div>
      </Popover>
    );
  }
}

export default compose(
  withRouter,
  Form.create({}),
  injectIntl,
)(InvoiceActions);
