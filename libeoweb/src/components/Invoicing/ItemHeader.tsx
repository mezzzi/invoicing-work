import { Col, Row } from 'antd';
import * as React from 'react';
import { FormattedMessage } from 'react-intl';

import { Span } from 'components/Typo';

interface IProps {}

interface IState {}

class ItemHeader extends React.PureComponent<IProps, IState> {
  render() {
    return (
      <Row type="flex" className="item-header">
        <Col span={3}>
          <Span>
            <FormattedMessage id="invoicing.detail.body.item.header.col1" />
          </Span>
        </Col>
        <Col span={2} offset={6}>
          <Span>
            <FormattedMessage id={'invoicing.detail.body.item.header.col2'} />
          </Span>
        </Col>
        <Col span={3} offset={1}>
          <Span>
            <FormattedMessage id={'invoicing.detail.body.item.header.col3'} />
          </Span>
        </Col>
        <Col span={1} offset={3}>
          <Span>
            <FormattedMessage id={'invoicing.detail.body.item.header.col4'} />
          </Span>
        </Col>
        <Col span={1} offset={4}>
          <Span>
            <FormattedMessage id={'invoicing.detail.body.item.header.col5'} />
          </Span>
        </Col>
      </Row>
    );
  }
}

export default ItemHeader;
