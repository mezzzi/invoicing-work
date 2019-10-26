import { Col, Row } from 'antd';
import { Back } from 'components/Button';
import { H1 } from 'components/Typo';
import * as React from 'react';
import { FormattedMessage } from 'react-intl';

interface IProps {
  partner: any;
}
interface IState {}

class NetworkPartner extends React.PureComponent<IProps, IState> {
  state = {};

  constructor(props: any) {
    super(props);
  }

  render() {
    const { partner } = this.props;
    const { naf, numberEmployees, siret, name, vatNumber } = partner;

    return (
      <>
        <Row className="partner-header">
          <Col span={24}>
            <Back>
              <FormattedMessage id="partner.header.btn_back" />
            </Back>
          </Col>
          <Col span={24}>
            <H1 css={{ flex: true, flexSize: 1 }}>{name}</H1>
          </Col>
        </Row>
        <Row className="partner-detail">
          <Col span={6}>
            <div className="partner-detail-label">
              <FormattedMessage id="partner.detail.siret" />
            </div>
            <div className="partner-detail-value">{siret}</div>
          </Col>
          <Col span={6}>
            <div className="partner-detail-label">
              <FormattedMessage id="partner.detail.naf" />
            </div>
            <div className="partner-detail-value">{naf}</div>
          </Col>
          <Col span={6}>
            <div className="partner-detail-label">
              <FormattedMessage id="partner.detail.vat_number" />
            </div>
            <div className="partner-detail-value">{vatNumber}</div>
          </Col>
          <Col span={6}>
            <div className="partner-detail-label">
              <FormattedMessage id="partner.detail.ref_customer" />
            </div>
            <div className="partner-detail-value" />
          </Col>
        </Row>
        <Row className="partner-detail">
          <Col span={12}>
            <div className="partner-detail-label">
              <FormattedMessage id="partner.detail.website" />
            </div>
            <div className="partner-detail-value" />
          </Col>
          <Col span={6}>
            <div className="partner-detail-label">
              <FormattedMessage id="partner.detail.number_of_employees" />
            </div>
            <div className="partner-detail-value">{numberEmployees}</div>
          </Col>
          <Col span={6}>
            <div className="partner-detail-label">
              <FormattedMessage id="partner.detail.social" />
            </div>
            <div className="partner-detail-value" />
          </Col>
        </Row>
      </>
    );
  }
}

export default NetworkPartner;
