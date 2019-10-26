import { Form } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import { Email, Submit, Text } from 'components/Form';
import * as Contacts from 'context/Contacts';
import * as React from 'react';
import { compose } from 'react-apollo';
import { FormattedMessage, InjectedIntlProps, injectIntl } from 'react-intl';
import * as Context from './context';

interface IProps
  extends FormComponentProps,
    InjectedIntlProps,
    Contacts.InjectedProps,
    Context.InjectedProps {
  companyId: string;
  onUpdate?: () => void;
}

interface IState {}

class ContactForm extends React.PureComponent<IProps, IState> {
  state = {};

  handleSubmit: (e: React.FormEvent) => void;

  constructor(props: any) {
    super(props);

    this.handleSubmit = this.submit.bind(this);
  }

  submit = async (e: React.FormEvent) => {
    e.preventDefault();
    this.props.form.validateFields(async (err, values) => {
      if (!err) {
        const { editContact, companyId, contact, onUpdate } = this.props;
        const create = contact && contact.create;
        const update = contact && contact.update;
        const id =
          editContact &&
          editContact.selectedContact &&
          editContact.selectedContact.id;

        const email = values.email;
        delete values.email;

        const updated = {
          ...values,
          companyId,
        };

        if (email) {
          let emailId;

          if (
            editContact &&
            editContact.selectedContact &&
            editContact.selectedContact.emails &&
            editContact.selectedContact.emails.rows &&
            editContact.selectedContact.emails.rows[0] &&
            typeof editContact.selectedContact.emails.rows[0].id !== 'undefined'
          ) {
            emailId = editContact.selectedContact.emails.rows[0].id;
          }

          updated.emails = [{ email, id: emailId }];
        }

        if (update && id) {
          await update(id, updated);
        } else if (create) {
          await create(updated);
        }
        editContact && editContact.done();
        onUpdate && onUpdate();
      }
    });
  };

  render() {
    const { form, intl, editContact } = this.props;
    const defaultValues = editContact && editContact.selectedContact;

    return (
      <Form className="form-address" onSubmit={this.handleSubmit}>
        <Text
          id="firstname"
          label={<FormattedMessage id="partners.contact.firstname" />}
          defaultValue={defaultValues ? defaultValues.firstname : ''}
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
          defaultValue={defaultValues ? defaultValues.lastname : ''}
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
            defaultValues &&
            defaultValues.emails &&
            defaultValues.emails.rows &&
            defaultValues.emails.rows.length > 0
              ? defaultValues.emails.rows[0].email
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
        <Submit label={{ id: 'addresses.form.submit' }} />
      </Form>
    );
  }
}

export default compose(
  Form.create({}),
  injectIntl,
  Context.hoc(),
  Contacts.hoc(),
)(ContactForm);
