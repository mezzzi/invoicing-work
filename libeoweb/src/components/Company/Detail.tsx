import { Col, Collapse, Row } from 'antd';
import { ICompany } from 'context/Company/types.d';
import * as React from 'react';
import { compose } from 'react-apollo';
import { FormattedMessage, InjectedIntlProps, injectIntl } from 'react-intl';
import { RouteComponentProps } from 'react-router';
import { toDisplayDate } from 'utils/common';
import legalForm from 'utils/legal-form';
import './Detail.module.less';

const Panel = Collapse.Panel;

interface IProps extends RouteComponentProps, InjectedIntlProps {
  company: ICompany;
}

interface IState {
  legalForms: any;
}

class Detail extends React.PureComponent<IProps, IState> {
  state = {
    legalForms: {},
  };

  constructor(props: any) {
    super(props);
  }

  async componentDidMount() {
    const legalForms = await legalForm.all();
    this.setState({ legalForms });
  }

  render() {
    const { company } = this.props;
    const { legalForms } = this.state;

    return company ? (
      <>
        <Row gutter={33} type="flex">
          <Col span={6}>
            <div className="company-infos-subtitle">
              <FormattedMessage id="infos.company.brandname" />
            </div>
            <div className="company-infos-value">
              {company.name || company.brandName || '-'}
            </div>
          </Col>
          <Col span={6}>
            <div className="company-infos-subtitle">
              <FormattedMessage id="infos.company.siren" />
            </div>
            <div className="company-infos-value">{company.siren || '-'}</div>
          </Col>
          <Col span={6}>
            <div className="company-infos-subtitle">
              <FormattedMessage id="infos.company.vatNumber" />
            </div>
            <div className="company-infos-value">
              {company.vatNumber || '-'}
            </div>
          </Col>
          <Col span={6}>
            <div className="company-infos-subtitle">
              <FormattedMessage id="infos.company.naf" />
            </div>
            <div className="company-infos-value">{company.naf || '-'}</div>
          </Col>
        </Row>
        <Row gutter={33} type="flex">
          <Col span={6}>
            <div className="company-infos-subtitle">
              <FormattedMessage id="infos.company.legal_form" />
            </div>
            <div className="company-infos-value">
              {(legalForms && (legalForms as any)[company.legalForm]) || '-'}
            </div>
          </Col>
          <Col span={6}>
            <div className="company-infos-subtitle">
              <FormattedMessage id="infos.company.capital" />
            </div>
            <div className="company-infos-value">{company.capital || '-'}</div>
          </Col>
          <Col span={6}>
            <div className="company-infos-subtitle">
              <FormattedMessage id="infos.company.incorporation_at" />
            </div>
            <div className="company-infos-value">
              {(company.incorporationAt &&
                toDisplayDate(company.incorporationAt)) ||
                '-'}
            </div>
          </Col>
          <Col span={6}>
            <div className="company-infos-subtitle">
              <FormattedMessage id="infos.company.number_employees" />
            </div>
            <div className="company-infos-value">
              {company.numberEmployees || '-'}
            </div>
          </Col>
        </Row>
      </>
    ) : null;
  }
}

export default compose(injectIntl)(Detail);
