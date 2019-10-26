import { Form } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import * as Partners from 'context/Partners';
import * as User from 'context/User';
import * as React from 'react';
import { compose } from 'react-apollo';
import { injectIntl } from 'react-intl';
import { IAutocompleteProps, IAutocompleteState } from './Autocomplete';
import AutocompleteSiren from './AutocompleteSiren';

interface IProps
  extends User.InjectedProps,
    IAutocompleteProps,
    FormComponentProps {
  placeholder?: string;
  footer?: React.ReactNode;
}
interface IState extends IAutocompleteState {}

class AutocompleteSirenPartners extends React.PureComponent<IProps, IState> {
  state = {
    value: '',
  };

  handleChange: (value: string) => void;
  handleScrollEnd: (more: any) => void;

  constructor(props: any) {
    super(props);

    this.handleChange = this.change.bind(this);
    this.handleScrollEnd = this.scrollEnd.bind(this);
  }

  change(value: string) {
    const { onValueChange } = this.props;
    onValueChange && onValueChange(value);
    this.setState({ value });
  }

  scrollEnd(more: any) {
    more && more();
  }

  render() {
    const { form } = this.props;
    const { value } = this.state;

    return (
      <Partners.Provider>
        <Partners.Consumer>
          {({ partners }) => {
            const rows =
              partners &&
              partners.data &&
              partners.data.partners &&
              partners.data.partners.rows;
            const total =
              partners &&
              partners.data &&
              partners.data.partners &&
              partners.data.partners.total;
            const loading = partners && partners.data && partners.data.loading;

            const more = partners && partners.more;

            const hasMore =
              rows && rows.length && total ? rows.length < total : false;

            let override = {};
            if (value === '') {
              override = {
                hasMore: value === '' ? hasMore : undefined,
                loading: value === '' ? loading : undefined,
                onScrollEnd:
                  value === ''
                    ? this.handleScrollEnd.bind(null, more)
                    : undefined,
                rows: value === '' ? rows : undefined,
              };
            }

            return (
              <AutocompleteSiren
                placeholder={this.props.placeholder}
                onValueChange={this.handleChange}
                form={form}
                rows={value === '' ? rows : undefined}
                {...this.props}
                {...override}
              />
            );
          }}
        </Partners.Consumer>
      </Partners.Provider>
    );
  }
}

export default compose(
  User.hoc(),
  injectIntl,
  Form.create({}),
)(AutocompleteSirenPartners);
