import { FormComponentProps } from 'antd/lib/form';
import { Autocomplete } from 'components/Search';
import * as Siren from 'context/Siren';
import * as User from 'context/User';
import * as React from 'react';
import { injectIntl } from 'react-intl';
import { IAutocompleteProps, IAutocompleteState } from './Autocomplete';

interface IProps
  extends User.InjectedProps,
    IAutocompleteProps,
    FormComponentProps {
  placeholder?: string;
  footer?: React.ReactNode;
}
interface IState extends IAutocompleteState {
  typing: boolean;
}

class AutocompleteSiren extends React.PureComponent<IProps, IState> {
  state = {
    typing: false,
    value: '',
  };

  handleChange: (value: string) => void;

  constructor(props: any) {
    super(props);

    this.handleChange = this.change.bind(this);
  }

  change(value: string) {
    const { onValueChange } = this.props;
    onValueChange && onValueChange(value);
    this.setState({ typing: true });
  }

  more = async (fetchMore: any, total: number, length: number) => {
    if (fetchMore) {
      await fetchMore({
        updateQuery: (prev: any, { fetchMoreResult }: any) => {
          if (!fetchMoreResult.searchCompanies) {
            return prev;
          }

          return {
            ...prev,
            searchCompanies: {
              ...prev.searchCompanies,
              rows: [
                ...prev.searchCompanies.rows,
                ...fetchMoreResult.searchCompanies.rows,
              ],
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

  search = async (value: string) => {
    this.setState({ value, typing: false });
  };

  render() {
    const { onSelect, type, form, rows, onValueChange, ...rest } = this.props;
    const { value, typing } = this.state;

    return (
      <Siren.Provider value={value} limit={10} offset={0}>
        <Siren.Consumer>
          {({ siren }) => {
            let rowsOrDefaultRows;
            let total;
            let loading;
            let hasMore;
            let fetchMore;

            if (!typing) {
              rowsOrDefaultRows =
                siren &&
                siren.data &&
                siren.data.searchCompanies &&
                siren.data.searchCompanies.rows
                  ? siren.data.searchCompanies.rows
                  : rows;
              total =
                siren &&
                siren.data &&
                siren.data.searchCompanies &&
                siren.data.searchCompanies.total;

              fetchMore = siren && siren.data && siren.data.fetchMore;
              loading = siren && siren.data && siren.data.loading;

              hasMore =
                rowsOrDefaultRows && rowsOrDefaultRows.length && total
                  ? rowsOrDefaultRows.length < total
                  : false;
            }

            return (
              <Autocomplete
                placeholder={this.props.placeholder}
                hasMore={hasMore}
                loading={loading}
                rows={!loading ? rowsOrDefaultRows : undefined}
                form={form}
                onSearch={this.search}
                defaultOpen={
                  !loading &&
                  value === '' &&
                  rowsOrDefaultRows &&
                  rowsOrDefaultRows.length > 0
                }
                loadMore={this.more.bind(
                  null,
                  fetchMore,
                  total,
                  rowsOrDefaultRows && rowsOrDefaultRows.length,
                )}
                type={type}
                onSelect={onSelect}
                onValueChange={this.handleChange}
                {...rest}
              />
            );
          }}
        </Siren.Consumer>
      </Siren.Provider>
    );
  }
}

export default injectIntl(User.hoc()(AutocompleteSiren));
