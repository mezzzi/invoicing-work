import { Col, Row } from 'antd';
import { Card } from 'components/Card';
import { IPartner } from 'context/Partner/types';
import * as Partners from 'context/Partners';
import * as React from 'react';
import { FormattedHTMLMessage, FormattedMessage } from 'react-intl';
import { RouteComponentProps } from 'react-router';
import { Link } from 'react-router-dom';
import Header from './Header';
import './Styles.module.less';

import CompanyAvatar from 'components/Avatar/CompanyAvatar';
import Infinity from 'components/Infinity';
import { Content } from 'components/Layout';

interface IProps extends RouteComponentProps {}
interface IState {}

class Network extends React.PureComponent<IProps, IState> {
  state = {};

  wrapperRef?: React.Component;
  handleWrapperRef: (node: React.Component) => void;

  constructor(props: any) {
    super(props);

    this.handleWrapperRef = this.setWrapperRef.bind(this);
  }

  setWrapperRef(node: React.Component) {
    this.wrapperRef = node;
  }

  more = async (fetchMore: any, total: number, length: number) => {
    if (fetchMore) {
      await fetchMore({
        updateQuery: (prev: any, { fetchMoreResult }: any) => {
          if (!fetchMoreResult.partners) {
            return prev;
          }

          return {
            ...prev,
            partners: {
              ...prev.partners,
              rows: [...prev.partners.rows, ...fetchMoreResult.partners.rows],
            },
          };
        },
        variables: {
          limit: 10,
          offset: length || 0,
        },
      });
    }
  };

  render() {
    return (
      <Partners.Provider limit={24} offset={0}>
        <Partners.Consumer>
          {data => {
            const dataPartners = data.partners && data.partners.data;
            const partners = dataPartners && dataPartners.partners;

            const hasMore =
              partners &&
              partners.rows &&
              partners.total &&
              partners.rows.length < partners.total;

            return (
              <Infinity
                hasMore={hasMore}
                loadMore={this.more.bind(
                  null,
                  dataPartners && dataPartners.fetchMore,
                  (partners && partners.total) || 0,
                  partners && partners.rows ? partners.rows.length : 0,
                )}
              >
                <Content>
                  <Header
                    total={partners && partners.total}
                    partners={partners}
                  />
                  {partners && partners.rows ? (
                    <Row type="flex" gutter={16}>
                      {partners.rows.map((partner: IPartner, i: number) => {
                        let concatenedAddress: string | null = null;
                        if (
                          partner.addresses &&
                          partner.addresses.rows &&
                          partner.addresses.rows[0]
                        ) {
                          const address = partner.addresses.rows[0];
                          concatenedAddress = `${
                            address.address1 ? `${address.address1} ` : ''
                          }${address.zipcode ? `${address.zipcode} ` : ''}${
                            address.city ? `${address.city} ` : ''
                          }${address.country ? `${address.country}` : ''}`;
                        }

                        const numberOfContacts =
                          partner.contacts && partner.contacts.total
                            ? partner.contacts.total
                            : 0;
                        return (
                          <Col key={i} span={6}>
                            <Link to={`/partner/${partner.id}`}>
                              <Card
                                center
                                avatar={<CompanyAvatar company={partner} />}
                                style={{
                                  marginBottom: '50px',
                                  minHeight: 'calc(100% - 50px)',
                                }}
                                shadow
                                title={partner.name}
                              >
                                <div className="partner-card-address">
                                  {concatenedAddress}
                                </div>
                                <Row className="full-width space">
                                  <Col
                                    className="network-card-invoice"
                                    span={12}
                                  >
                                    <span className="network-card-invoice-value">
                                      {partner.invoicesSent}
                                    </span>
                                  </Col>
                                  <Col
                                    className="network-card-invoice"
                                    span={12}
                                  >
                                    <span className="network-card-invoice-value">
                                      {partner.invoicesReceived}
                                    </span>
                                  </Col>
                                </Row>
                                <Row className="full-width">
                                  <Col
                                    className="network-card-invoice"
                                    span={12}
                                  >
                                    <span className="network-card-invoice-title">
                                      <FormattedMessage id="partner.card.invoice_sent" />
                                    </span>
                                  </Col>
                                  <Col
                                    className="network-card-invoice"
                                    span={12}
                                  >
                                    <span className="network-card-invoice-title">
                                      <FormattedMessage id="partner.card.invoice_received" />
                                    </span>
                                  </Col>
                                </Row>
                                <Row align="middle" className="space">
                                  <span className="network-card-footer">
                                    <FormattedHTMLMessage
                                      id="partner.card.contact_number"
                                      values={{
                                        count: numberOfContacts,
                                      }}
                                    />
                                  </span>
                                </Row>
                              </Card>
                            </Link>
                          </Col>
                        );
                      })}
                    </Row>
                  ) : null}
                </Content>
              </Infinity>
            );
          }}
        </Partners.Consumer>
      </Partners.Provider>
    );
  }
}

export default Network;
