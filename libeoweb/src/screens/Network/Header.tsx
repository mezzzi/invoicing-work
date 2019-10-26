import { Form } from 'antd';
import { Row } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import { Popin } from 'components/Popin';
import { AutocompleteSiren } from 'components/Search';
import { Heading } from 'components/Typo';
import { IInputCompany } from 'context/Company/types.d';
import * as Partner from 'context/Partner';
import { IInputPartner } from 'context/Partner/types';
import * as Partners from 'context/Partners';
import * as React from 'react';
import { compose } from 'react-apollo';

interface IProps extends Partners.InjectedProps, FormComponentProps {
  total: number;
}

interface IState {
  popinVisible: boolean;
  value: string;
}

class NetworkHeader extends React.PureComponent<IProps, IState> {
  state = {
    popinVisible: false,
    value: '',
  };

  handleSelect: (create: any, item: IInputCompany) => void;
  handleCloseSearch: () => void;
  handleOpenSearch: () => void;
  handleValueChange: (value: string) => void;

  constructor(props: any) {
    super(props);

    this.handleValueChange = this.valueChange.bind(this);
    this.handleSelect = this.select.bind(this);
    this.handleCloseSearch = this.closeSearch.bind(this);
    this.handleOpenSearch = this.openSearch.bind(this);
  }

  valueChange(value: string) {
    this.setState({ value });
  }

  async select(create: any, item: IInputCompany) {
    const { partners } = this.props;
    await create(item as IInputPartner, partners && partners.data.variables);

    if (partners && partners.data && partners.data) {
      await partners.data.refetch(partners && partners.data.variables);
    }
    this.setState({ popinVisible: false });
  }

  closeSearch() {
    this.setState({ popinVisible: false });
  }

  openSearch() {
    this.setState({ popinVisible: true });
  }

  render() {
    const { total, form } = this.props;
    const { popinVisible } = this.state;

    return (
      <Partner.Provider>
        <Partner.Consumer>
          {({ partner }) => {
            return (
              <Row type="flex">
                <Heading
                  button={'network.header.btn_add_partners'}
                  onClick={this.handleOpenSearch}
                  descriptionVariables={{ count: total }}
                  description="network.header.description"
                  title="network.header.title"
                />
                <Popin
                  onClose={this.handleCloseSearch}
                  onCancel={this.handleCloseSearch}
                  className="modal-search-partners"
                  visible={popinVisible}
                  footer={null}
                >
                  {popinVisible && (
                    <AutocompleteSiren
                      placeholder="search.company.search_placeholder"
                      form={form}
                      type="partners"
                      onSelect={this.handleSelect.bind(
                        null,
                        partner && partner.create,
                      )}
                    />
                  )}
                </Popin>
              </Row>
            );
          }}
        </Partner.Consumer>
      </Partner.Provider>
    );
  }
}

export default compose(
  Form.create({}),
  Partners.hoc(),
)(NetworkHeader);
