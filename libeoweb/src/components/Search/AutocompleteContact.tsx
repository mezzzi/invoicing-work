import { Tag } from 'antd';
import { Search } from 'components/Form';
import { InputRules, IType } from 'components/Form/Default';
import * as React from 'react';
import { FormattedMessage, InjectedIntlProps, injectIntl } from 'react-intl';

import searchIcon from '-!svg-react-loader!assets/icons/search.svg';
import { Icon } from 'components/Assets';
import { IconValue } from 'components/Assets/Icon';
import { BtnType, Button } from 'components/Button';
import { ContactSearch } from 'components/Contacts';
import { IContact } from 'context/Contacts/types.d';
import { IEmail } from 'context/Emails/types';
const SearchIcon: any = searchIcon;

export interface IAutocompleteProps extends InjectedIntlProps {
  placeholder?: string;
  refetchPartner: () => void;
  onSubmit?: (contactsIds?: string[]) => void;
  companyId?: number;
  form?: any;
  onSelect?: (item: IContact) => void;
  onSearch?: (value: string) => void;
  onValueChange?: (value: string) => void;
  onFocus?: () => void;
  onBlur?: () => void;
  onLeave?: () => void;
  rows?: IContact[];
  rules?: InputRules[];
  inline?: boolean;
  type: string;
}

export interface IAutocompleteState {
  contacts: IContact[];
  value: string;
  open?: boolean;
  newContact: boolean;
}

class SearchAutocompleteContact extends React.PureComponent<
  IAutocompleteProps,
  IAutocompleteState
> {
  state = {
    contacts: [],
    newContact: false,
    open: false,
    value: '',
  };

  handleSetWrapperRef: (node: HTMLDivElement) => void;
  handleAddContact: (contact: IContact) => void;
  handleCancelContact: () => void;
  handleShowContactSearch: () => void;
  handleSearch: (value: string) => void;
  handleRemove: (contact: IContact) => void;
  handleChange: (node: React.ChangeEvent<Element>) => void;
  handleFocus?: (event: React.FocusEvent<HTMLInputElement>) => any;
  handleBlur?: (event: React.FocusEvent<HTMLInputElement>) => any;
  handleClickOutside?: (event: Event) => void;

  wrapperRef?: HTMLDivElement;

  constructor(props: any) {
    super(props);

    this.handleClickOutside = this.clickOutside.bind(this);
    this.handleShowContactSearch = this.showContactSearch.bind(this);
    this.handleAddContact = this.addContact.bind(this);
    this.handleCancelContact = this.cancelContact.bind(this);
    this.handleSetWrapperRef = this.setWrapperRef.bind(this);
    this.handleSearch = this.search.bind(this);
    this.handleRemove = this.remove.bind(this);
    this.handleChange = this.change.bind(this);
    this.handleFocus = this.focus.bind(this);
    this.handleBlur = this.blur.bind(this);
  }

  setWrapperRef(node: HTMLDivElement) {
    if (node) {
      this.wrapperRef = node;
    }
  }

  showContactSearch() {
    this.setState({
      newContact: true,
    });
  }

  addContact(contact: IContact) {
    this.setState({
      contacts: [...this.state.contacts, contact],
      newContact: false,
    });
  }

  cancelContact() {
    this.setState({
      newContact: false,
    });
  }

  clickOutside(event: Event) {
    const target: HTMLElement = event.target as HTMLElement;
    if (target && this.wrapperRef && !this.wrapperRef.contains(target)) {
      this.props.onLeave && this.props.onLeave();
      this.setState({ open: false });
    }

    return true;
  }

  remove(contact: IContact) {
    const contacts: IContact[] = [];
    this.state.contacts.map((currentContact: IContact) => {
      if (contact.id !== currentContact.id) {
        contacts.push(currentContact);
      }
    });
    this.setState({
      contacts,
    });
  }

  blur(event: React.FocusEvent<HTMLInputElement>) {
    this.props.onBlur && this.props.onBlur();
  }

  focus(event: React.FocusEvent<HTMLInputElement>) {
    this.props.onFocus && this.props.onFocus();
    this.setState({ open: true });
  }

  search(value: string): void {
    // const { onSearch } = this.props;
    // this.setState({ value });
    // onSearch && onSearch(value);
  }

  change(node: React.ChangeEvent<Element>): void {
    const { onValueChange } = this.props;
    const target: any = node.currentTarget;
    this.setState({ value: target.value });
    onValueChange && onValueChange(target.value);
  }

  select(contact: IContact) {
    const { onSelect } = this.props;

    this.setState({
      contacts: [...this.state.contacts, contact],
    });

    onSelect && onSelect(contact);
    this.setState({ open: false });
  }

  componentDidMount() {
    document.addEventListener('click', this
      .handleClickOutside as EventListener);
  }

  componentWillUnmount() {
    this.wrapperRef = undefined;
    document.addEventListener('click', this
      .handleClickOutside as EventListener);
    const { onSearch } = this.props;
    this.setState({ value: '' });
    onSearch && onSearch('');
  }

  renderSearch() {
    const { rows, form, intl } = this.props;
    const { open, value } = this.state;

    if (!open) {
      return;
    }

    const dataSource: any = [];
    if (rows && rows.length > 0) {
      rows.map((contact: IContact, i: number) => {
        dataSource.concat(
          contact.emails &&
            contact.emails.rows.map((email: IEmail, j: number) => {
              const fullname = `${contact.firstname} ${contact.lastname}`;

              if (
                !new RegExp(value).test(email.email) &&
                !new RegExp(value).test(fullname)
              ) {
                return;
              }

              dataSource.push(
                <div
                  key={`${i}-${j}`}
                  onClick={this.select.bind(this, contact)}
                  className="search-result-item small"
                >
                  <div className="contact-title">{fullname}</div>
                  <div className="contact-email">
                    {' <'}
                    {email.email}
                    {'>'}
                  </div>
                </div>,
              );
            }),
        );
      });
    }

    return <div className="search-result">{dataSource}</div>;
  }

  render() {
    const {
      form,
      rules,
      intl,
      type,
      inline,
      onSubmit,
      refetchPartner,
      companyId,
    } = this.props;
    const { contacts, newContact } = this.state;

    const contactsIds: string[] = contacts.map(
      (contact: IContact) => `${contact.id}`,
    );

    return (
      <div
        ref={this.handleSetWrapperRef}
        className={`search-autocomplete ${type} search-autocomplete-${
          inline ? 'inline' : 'floating'
        }`}
      >
        <div className="select-contact-title">
          <FormattedMessage id="purchase.pay.notification" />
        </div>
        {contacts && contacts.length > 0 && (
          <div className="contacts-tag">
            {contacts.map((contact: IContact, i: number) => {
              return (
                <Tag
                  onClick={this.handleRemove.bind(null, contact)}
                  key={`${i}`}
                >
                  {contact.firstname}
                  <Icon value={IconValue.Cross} />
                </Tag>
              );
            })}
          </div>
        )}
        <div className="autocomplete-contacts">
          <Search
            rules={rules}
            form={form}
            type={IType.Search}
            onSearch={this.handleSearch}
            onChange={this.handleChange}
            onBlur={this.handleBlur}
            onFocus={this.handleFocus}
            className={'input-autocomplete'}
            prefix={
              !inline && <SearchIcon color="#0053FA" className="search-icon" />
            }
            autoComplete={'off'}
            placeholder={
              !inline
                ? intl.formatMessage({
                    id: 'invoice.contact.contact_placeholder',
                  })
                : undefined
            }
            label={
              inline
                ? intl.formatMessage({
                    id: 'invoice.contact.contact_placeholder',
                  })
                : null
            }
          >
            <div onClick={this.handleShowContactSearch} className="add-contact">
              <Icon value={IconValue.Plus} />
              <FormattedMessage id="invoice.contact.contact_add" />
            </div>
            {this.renderSearch()}
          </Search>
        </div>
        {newContact ? (
          <>
            <div className="select-contact-title">
              <FormattedMessage id="partners.contact.form_add_title" />
            </div>
            <ContactSearch
              companyId={companyId}
              refetchPartner={refetchPartner}
              onSubmit={this.handleAddContact}
              onCancel={this.handleCancelContact}
            />
          </>
        ) : (
          <div className="contact-actions">
            <Button
              type={BtnType.Primary}
              onClick={onSubmit && onSubmit.bind(null, contactsIds)}
            >
              <FormattedMessage id="partners.contact.submit" />
            </Button>
          </div>
        )}
      </div>
    );
  }
}

export default injectIntl(SearchAutocompleteContact);
