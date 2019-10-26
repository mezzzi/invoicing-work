import { Col, Row } from 'antd';
import { FooterAdd } from 'components/Button';
import { Card, CardRow } from 'components/Card';
import { H3 } from 'components/Typo';
import { Shadow } from 'components/Wrapper';
import { IContact } from 'context/Contacts/types.d';
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import * as Context from './context';

interface IProps extends Context.InjectedProps {
  contacts?: IContact[];
}
interface IState {}

class Addresses extends React.PureComponent<IProps, IState> {
  state = {};

  render() {
    const { contacts, editContact } = this.props;
    const edit = editContact && editContact.edit;

    return (
      <Shadow className="company-contacts">
        <Row>
          <H3 className="uppercase">
            <FormattedMessage id="contacts.form.contacts_title" />
          </H3>
        </Row>
        <Row gutter={49}>
          {contacts &&
            contacts.map((contact: IContact, i: number) => (
              <Col
                style={{ minWidth: '200px', marginBottom: '28px' }}
                key={`${i}`}
                span={8}
              >
                <Card
                  onEdit={edit && edit.bind(this, contact)}
                  editable
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
                        title={<FormattedMessage id="contacts.card.email" />}
                        rows={contact.emails.rows.map(row => row.email)}
                      />
                    )}
                </Card>
              </Col>
            ))}
        </Row>
        <Row>
          <FooterAdd onClick={edit && edit.bind(this, undefined)}>
            <FormattedMessage id="contacts.form.btn_add" />
          </FooterAdd>
        </Row>
      </Shadow>
    );
  }
}

export default Context.hoc()(Addresses);
