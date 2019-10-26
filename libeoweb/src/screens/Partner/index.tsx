import { Col, Row } from 'antd';
import Addresses from 'components/Addresses';
import AddressForm from 'components/Addresses/AddressForm';
import * as EditAddressCtx from 'components/Addresses/context';
import { Back } from 'components/Button';
import Detail from 'components/Company/Detail';
import { ContactForm, Contacts } from 'components/Contacts';
import * as EditContactsCtx from 'components/Contacts/context';
import { Content, RightSideBar } from 'components/Layout';
import { H1 } from 'components/Typo';
import * as ContactsCtx from 'context/Contacts';
import * as Partner from 'context/Partner';
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { RouteComponentProps, withRouter } from 'react-router';
// import ContactForm from './ContactForm';
// import Contacts from './Contacts';
import './Styles.css';

interface IProps extends RouteComponentProps {}
interface IState {}

class PartnersComponent extends React.PureComponent<IProps, IState> {
  state = {};

  close = (addressDone?: () => void, contactDone?: () => void) => {
    addressDone && addressDone();
    contactDone && contactDone();
  };

  render() {
    const match: any = this.props.match;

    return (
      <Partner.Provider id={match.params.id}>
        <Partner.Consumer>
          {({ partner }) => {
            const data = partner && partner.data;
            if (!data) {
              return;
            }

            return (
              <ContactsCtx.Provider>
                <EditContactsCtx.Provider>
                  <EditContactsCtx.Consumer>
                    {({ editContact }) => {
                      let sidebarContact: React.ReactNode;

                      if (editContact && editContact.editing) {
                        sidebarContact = (
                          <ContactForm
                            onUpdate={data && data.refetch}
                            companyId={data.partner && data.partner.id}
                          />
                        );
                      }

                      return (
                        <EditAddressCtx.Provider>
                          <EditAddressCtx.Consumer>
                            {({ editAddress }) => {
                              let sidebarAddress: React.ReactNode;

                              if (editAddress && editAddress.editing) {
                                sidebarAddress = (
                                  <AddressForm
                                    onUpdate={data && data.refetch}
                                    companyId={data.partner && data.partner.id}
                                  />
                                );
                              }

                              return (
                                <RightSideBar
                                  style={{
                                    maxWidth: 400,
                                    width: '100%',
                                  }}
                                  closable={true}
                                  onClose={this.close.bind(
                                    null,
                                    editContact && editContact.done,
                                    editAddress && editAddress.done,
                                  )}
                                  sidebar={sidebarContact || sidebarAddress}
                                >
                                  <Content>
                                    {data.partner && (
                                      <>
                                        <Row className="partner-header">
                                          <Col span={24}>
                                            <Back>
                                              <FormattedMessage id="partner.header.btn_back" />
                                            </Back>
                                          </Col>
                                          <Col span={24}>
                                            <H1
                                              css={{ flex: true, flexSize: 1 }}
                                            >
                                              {data.partner &&
                                                (data.partner.name ||
                                                  data.partner.brandName)}
                                            </H1>
                                          </Col>
                                        </Row>
                                        <Detail company={data.partner} />
                                        {data.partner &&
                                          data.partner.addresses &&
                                          data.partner.addresses.rows && (
                                            <Addresses
                                              addresses={
                                                data.partner.addresses.rows
                                              }
                                            />
                                          )}

                                        {data.partner &&
                                          data.partner.contacts &&
                                          data.partner.contacts.rows && (
                                            <Contacts
                                              contacts={
                                                data.partner.contacts.rows
                                              }
                                            />
                                          )}
                                      </>
                                    )}
                                  </Content>
                                </RightSideBar>
                              );
                            }}
                          </EditAddressCtx.Consumer>
                        </EditAddressCtx.Provider>
                      );
                    }}
                  </EditContactsCtx.Consumer>
                </EditContactsCtx.Provider>
              </ContactsCtx.Provider>
            );
          }}
        </Partner.Consumer>
      </Partner.Provider>
    );
  }
}

export default withRouter(PartnersComponent);
