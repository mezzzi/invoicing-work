import { Form } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import { Email, Hidden, Submit, Text } from 'components/Form';
import * as Contacts from 'context/Contacts';
import { IContact, IInputContact } from 'context/Contacts/types.d';
import * as React from 'react';
import { compose } from 'react-apollo';
import { FormattedMessage, InjectedIntlProps, injectIntl } from 'react-intl';

interface IProps extends FormComponentProps, InjectedIntlProps {
  refetchPartner: () => {};
  onSubmit?: () => void;
  companyId: number;
  editContact?: IContact;
}

interface IState {}

class ContactForm extends React.PureComponent<IProps, IState> {
  state = {};

  handleSubmit: (
    contact: any,
    refetchPartner: () => void,
    e: React.FormEvent,
  ) => void;

  constructor(props: any) {
    super(props);

    this.handleSubmit = this.submit.bind(this);
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
          onSubmit && onSubmit();
        } else {
          if (contact && contact.create) {
            await contact.create(newContact);
          }
          refetchPartner();
          onSubmit && onSubmit();
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
              <Form
                className="form-contact"
                onSubmit={this.handleSubmit.bind(null, contact, refetchPartner)}
              >
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
                <Submit label={{ id: 'partners.contact.submit' }} />
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
)(ContactForm);
