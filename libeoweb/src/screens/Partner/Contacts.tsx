import { Col, Row } from 'antd';
import { FooterAdd } from 'components/Button';
import { Card, CardRow } from 'components/Card';
import { H3 } from 'components/Typo';
import { Shadow } from 'components/Wrapper';
import { IContact } from 'context/Contacts/types.d';
import * as React from 'react';
import { FormattedMessage } from 'react-intl';

interface IProps {
  partner: any;
  onSelectContact?: (contact: IContact | null) => void;
}
interface IState {}

class ContactsPartner extends React.PureComponent<IProps, IState> {
  state = {};

  handleSelectContact: (contact: IContact | null) => void;
  constructor(props: any) {
    super(props);

    this.handleSelectContact = this.selectContact.bind(this);
  }

  selectContact(contact: IContact | null) {
    const { onSelectContact } = this.props;

    onSelectContact && onSelectContact(null);
    onSelectContact && onSelectContact(contact);
  }

  render() {
    const { partner } = this.props;
    const { contacts } = partner;

    return (
      <Shadow className="partner-contacts">
        <Row gutter={28}>
          <H3 className="uppercase">
            <FormattedMessage id="partner.contacts.title" />
          </H3>
          {contacts &&
            contacts.rows &&
            contacts.rows.map((contact: IContact, i: number) => (
              <Col
                onClick={this.handleSelectContact.bind(this, contact)}
                style={{ minWidth: '200px', marginBottom: '28px' }}
                key={`${i}`}
                span={8}
              >
                <Card
                  shadow
                  avatar={`${contact.firstname &&
                    contact.firstname.substring(0, 1)}${contact.lastname &&
                    contact.lastname.substring(0, 1)}`}
                  title={`${contact.firstname ? `${contact.firstname} ` : ''}${
                    contact.lastname ? `${contact.lastname} ` : ''
                  }`}
                >
                  {contact.emails &&
                    contact.emails &&
                    contact.emails &&
                    contact.emails.rows &&
                    contact.emails.rows.length > 0 && (
                      <CardRow
                        title={<FormattedMessage id="partner.contacts.email" />}
                        rows={contact.emails.rows.map(row => row.email)}
                      />
                    )}
                </Card>
              </Col>
            ))}
        </Row>
        <Row>
          <FooterAdd onClick={this.handleSelectContact.bind(this, null)}>
            <FormattedMessage id="partner.contacts.btn_add" />
          </FooterAdd>
        </Row>
      </Shadow>
    );
  }
}

export default ContactsPartner;
