import { Form } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import { BtnType, Button } from 'components/Button';
import { Email, Hidden, Text } from 'components/Form';
import * as Contacts from 'context/Contacts';
import { IContact, IInputContact } from 'context/Contacts/types.d';
import * as React from 'react';
import { compose } from 'react-apollo';
import { FormattedMessage, InjectedIntlProps, injectIntl } from 'react-intl';

interface IProps extends FormComponentProps, InjectedIntlProps {
  refetchPartner: () => void;
  onSubmit?: (contact: any) => void;
  onCancel?: () => void;
  companyId?: number;
  editContact?: IContact;
}

interface IState {}

class ContactSearch extends React.PureComponent<IProps, IState> {
  state = {};

  handleSubmit: (
    contact: any,
    refetchPartner: () => void,
    e: React.FormEvent,
  ) => void;
  handleCancel: () => void;

  constructor(props: any) {
    super(props);

    this.handleSubmit = this.submit.bind(this);
    this.handleCancel = this.cancel.bind(this);
  }

  cancel() {
    this.props.onCancel && this.props.onCancel();
  }

  submit = async (
    contact: any,
    refetchPartner: () => void,
    e: React.FormEvent,
  ) => {
    e.preventDefault();
    this.props.form.validateFields(async (err, values) => {
      if (!err) {
        const { editContact, companyId, onSubmit } = this.props;
        const newContact: IInputContact = {
          // companyId,
          firstname: values.firstname,
          lastname: values.lastname,
        };
        if (values.email) {
          let id;

          if (
            editContact &&
            editContact.emails &&
            editContact.emails.rows &&
            editContact.emails.rows[0] &&
            typeof editContact.emails.rows[0].id !== 'undefined'
          ) {
            id = editContact.emails.rows[0].id;
          }

          newContact.emails = [{ email: values.email, id }];
        }

        if (editContact) {
          if (contact && contact.create) {
            contact.update(values.id, newContact);
          }
          onSubmit && onSubmit(contact);
        } else {
          if (contact && contact.create) {
            const savedContact: IContact = await contact.create(newContact);
            refetchPartner();
            onSubmit && onSubmit(savedContact);
          }
        }
      }
    });
  };

  render() {
    const { form, intl, editContact, refetchPartner } = this.props;
    return (
      <Contacts.Provider>
        <Contacts.Consumer>
          {({ contact }) => {
            return (
              <Form className="search-contact">
                <Hidden
                  id="id"
                  defaultValue={editContact ? editContact.id : ''}
                  form={form}
                />
                <Text
                  id="firstname"
                  label={<FormattedMessage id="partners.contact.firstname" />}
                  defaultValue={editContact ? editContact.firstname : ''}
                  rules={[
                    {
                      message: intl.formatMessage({
                        id: 'partners.contact.firstname_error',
                      }),
                      required: true,
                    },
                  ]}
                  form={form}
                />
                <Text
                  id="lastname"
                  label={<FormattedMessage id="partners.contact.lastname" />}
                  defaultValue={editContact ? editContact.lastname : ''}
                  rules={[
                    {
                      message: intl.formatMessage({
                        id: 'partners.contact.lastname_error',
                      }),
                      required: true,
                    },
                  ]}
                  form={form}
                />
                <Email
                  id="email"
                  defaultValue={
                    editContact &&
                    editContact.emails &&
                    editContact.emails.rows &&
                    editContact.emails.rows.length > 0
                      ? editContact.emails.rows[0].email
                      : ''
                  }
                  label={<FormattedMessage id="partners.contact.email" />}
                  rules={[
                    {
                      message: intl.formatMessage({
                        id: 'partners.contact.email_error',
                      }),
                      pattern: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                      required: true,
                    },
                  ]}
                  form={form}
                />
                <div className="contact-actions">
                  <Button type={BtnType.Default} onClick={this.handleCancel}>
                    <FormattedMessage id="partners.contact.cancel" />
                  </Button>
                  <Button
                    type={BtnType.Primary}
                    onClick={this.handleSubmit.bind(
                      null,
                      contact,
                      refetchPartner,
                    )}
                  >
                    <FormattedMessage id="partners.contact.submit" />
                  </Button>
                </div>
              </Form>
            );
          }}
        </Contacts.Consumer>
      </Contacts.Provider>
    );
  }
}

export default compose(
  Form.create({}),
  injectIntl,
)(ContactSearch);
