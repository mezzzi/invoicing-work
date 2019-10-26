import { Col, Row, Tag } from 'antd';
import { Icon } from 'components/Assets';
import { IconValue } from 'components/Assets/Icon';
import { BtnType, Button, InvoiceActions } from 'components/Button';
import { ActionHandlerType } from 'components/Button/InvoiceActions';
import { IInvoice, InvoiceStatus } from 'context/Invoice/types';
import * as React from 'react';
import {
  FormattedMessage,
  FormattedNumber,
  InjectedIntlProps,
  injectIntl,
} from 'react-intl';
import { staticAssets, toPickerDate } from 'utils/common';
import './Detail.module.less';
import News from './News';
import Product from './Product';

interface IProps extends InjectedIntlProps {
  onCtaClick?: (invoice: IInvoice) => void;
  invoice: IInvoice;
  btnLoading?: boolean;
  actions: Array<{
    type: string;
    handle?: ActionHandlerType;
  }>;
}
interface IState {}

class Detail extends React.PureComponent<IProps, IState> {
  state = {};

  constructor(props: any) {
    super(props);
  }

  render() {
    const { invoice, intl, actions, onCtaClick, btnLoading } = this.props;
    const history = invoice.history;

    return (
      <div className="detail-wrapper">
        <div className="detail-wrapper-header">
          <Row gutter={15}>
            <Col className="detail-number">{invoice.number}</Col>
          </Row>
          <Row gutter={15} type="flex">
            <Col className="detail-receiver-title">{invoice.receiverTitle}</Col>
            <Col className="detail-total">
              <FormattedNumber
                style="currency"
                currency={invoice.currency}
                value={invoice.total}
              />
            </Col>
          </Row>
          <Row className="detail-receiver" gutter={15} type="flex">
            <Col span={10}>
              {(invoice.companyEmitter && invoice.companyEmitter.name) ||
                (invoice.companyEmitter && invoice.companyEmitter.brandName)}
            </Col>
            <Col
              style={{
                flex: 1,
              }}
            >
              <Row type="flex">
                <Col
                  style={{
                    flex: 1,
                  }}
                >
                  <a
                    className="detail-invoice-link"
                    target="_blank"
                    href={staticAssets(invoice.filepath)}
                  >
                    <Icon value={IconValue.EyeOpen} />
                    <FormattedMessage id="invoice.detail.open_invoice" />
                  </a>
                </Col>
                <Col>
                  <InvoiceActions actions={actions} invoice={invoice} />
                </Col>
              </Row>
            </Col>
            <Col>
              {invoice.status === InvoiceStatus.Planned && (
                <Button
                  loading={btnLoading}
                  onClick={
                    !btnLoading && onCtaClick
                      ? onCtaClick.bind(null, invoice)
                      : undefined
                  }
                  type={BtnType.Default}
                >
                  <FormattedMessage id="invoice.detail.cancel" />
                </Button>
              )}
              {invoice.status === InvoiceStatus.ToPay && (
                <Button
                  loading={btnLoading}
                  onClick={
                    !btnLoading && onCtaClick
                      ? onCtaClick.bind(null, invoice)
                      : undefined
                  }
                  type={BtnType.Primary}
                >
                  <FormattedMessage id="invoice.detail.to_pay_at_deadline" />
                </Button>
              )}
            </Col>
          </Row>
          <Row gutter={15} type="flex" className="detail-wrapper-spacer">
            <Col span={10} className="detail-list-description">
              <FormattedMessage id="invoice.detail.due_date" />
            </Col>
            <Col className="detail-list-value">
              {toPickerDate(invoice.dueDate).format('DD/MM/YYYY')}
            </Col>
          </Row>
          <Row gutter={15} type="flex" className="detail-wrapper-spacer">
            <Col span={10} className="detail-list-description">
              <FormattedMessage id="invoice.detail.status" />
            </Col>
            <Col className="detail-list-value">
              <Tag className={`tag-${invoice.status.toLowerCase()}`}>
                {intl.formatMessage({
                  id: `purchase.table.status_${invoice.status.toLowerCase()}`,
                })}
              </Tag>
            </Col>
          </Row>
          <Row gutter={15} type="flex" className="detail-wrapper-spacer">
            <Col span={10} className="detail-list-description">
              <FormattedMessage id="invoice.detail.purchase_account" />
            </Col>
            <Col className="detail-list-value">
              {invoice.purchaseAccount && invoice.purchaseAccount.key}
            </Col>
          </Row>
        </div>
        <News invoice={invoice} history={history} />
        <Product invoice={invoice} />
      </div>
    );
  }
}

export default injectIntl(Detail);
