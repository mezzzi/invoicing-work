import { Col, Row } from 'antd';
import { IInvoice } from 'context/Invoice/types';
import * as React from 'react';
import { FormattedMessage, FormattedNumber } from 'react-intl';
import Card from './Card';
import './Product.css';

interface IProps {
  invoice: IInvoice;
}

interface IState {}

class Product extends React.PureComponent<IProps, IState> {
  state = {};

  constructor(props: any) {
    super(props);
  }

  render() {
    const { invoice } = this.props;

    return (
      <Card title="invoice.detail.product_title">
        {invoice && (
          <>
            <Row className="row" type="flex">
              <Col className="row-head" span={8}>
                <FormattedMessage id="invoice.detail.product_ht" />
              </Col>
              <Col className="row-head center" span={8}>
                <FormattedMessage id="invoice.detail.product_vat" />
              </Col>
              <Col className="row-head right" span={8}>
                <FormattedMessage id="invoice.detail.product_tt" />
              </Col>
            </Row>
            <Row className="row" type="flex">
              <Col className="row-body-dark" span={8}>
                <FormattedNumber
                  style="currency"
                  currency={invoice.currency}
                  value={invoice.totalWoT}
                />
              </Col>
              <Col className="row-body-dark center" span={8}>
                <FormattedNumber
                  style="currency"
                  currency={invoice.currency}
                  value={
                    Math.round((invoice.total - invoice.totalWoT) * 100) / 100
                  }
                />
              </Col>
              <Col className="row-body-dark right" span={8}>
                <FormattedNumber
                  style="currency"
                  currency={invoice.currency}
                  value={invoice.total}
                />
              </Col>
            </Row>
          </>
        )}
      </Card>
    );
  }
}

export default Product;
