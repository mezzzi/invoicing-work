import { Form } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import { AutocompleteContact } from 'components/Search';
import { IInvoice } from 'context/Invoice/types';
import * as Partner from 'context/Partner';
import { IPartner } from 'context/Partner/types';
import * as React from 'react';
import { compose } from 'react-apollo';
import { InjectedIntlProps, injectIntl } from 'react-intl';
import './SelectContact.module.less';

interface IProps extends InjectedIntlProps, FormComponentProps {
  invoice: IInvoice;
  onSubmit?: (invoice: IInvoice, contactsIds?: string[]) => void;
}
interface IState {}

class SelectContact extends React.PureComponent<IProps, IState> {
  state = {};

  constructor(props: any) {
    super(props);
  }

  render() {
    const { invoice, form, onSubmit } = this.props;
    const companyEmitter: IPartner = invoice && invoice.companyEmitter;

    return (
      companyEmitter && (
        <Partner.Provider id={companyEmitter.id}>
          <Partner.Consumer>
            {({ partner }) => {
              const contacts =
                partner &&
                partner.data &&
                partner.data.partner &&
                partner.data.partner.contacts &&
                partner.data.partner.contacts.rows;

              return (
                <div className="select-contact-wrapper">
                  <AutocompleteContact
                    onSubmit={onSubmit && onSubmit.bind(null, invoice)}
                    inline
                    rows={contacts}
                    form={form}
                    companyId={companyEmitter.id}
                    refetchPartner={
                      partner && partner.data && partner.data.refetch
                    }
                    type="contact"
                  />
                </div>
              );
            }}
          </Partner.Consumer>
        </Partner.Provider>
      )
    );
  }
}

export default compose(
  Form.create({}),
  injectIntl,
)(SelectContact);
