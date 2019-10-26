import { Col, Row } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import CompanyAvatar from 'components/Avatar/CompanyAvatar';
import { BtnType, Button } from 'components/Button';
import AutocompleteSirenPartners from 'components/Search/AutocompleteSirenPartners';
import { ICompany, IInputCompany } from 'context/Company/types.d';
import * as React from 'react';
import { FormattedMessage, InjectedIntlProps, injectIntl } from 'react-intl';

interface IProps extends InjectedIntlProps, FormComponentProps {
  onChangePartner: (partner?: IInputCompany) => void;
  defaultPartner?: ICompany;
}
interface IState {
  open: boolean;
  value: string;
  visible: boolean;
  partner?: IInputCompany | null;
}

class ControlPartner extends React.PureComponent<IProps, IState> {
  static getDerivedStateFromProps(props: IProps, state: IState) {
    if (props.defaultPartner && !state.partner) {
      props.onChangePartner &&
        props.onChangePartner(props.defaultPartner as IInputCompany);
      return { partner: props.defaultPartner };
    }
    return state;
  }
  state = {
    open: false,
    partner: undefined,
    value: '',
    visible: false,
  };

  handleScrollEnd: (more: any) => void;
  handleSelect: (item: IInputCompany) => void;
  handleChangePartner: () => void;
  handleCancelChangePartner: () => void;

  constructor(props: any) {
    super(props);

    this.handleScrollEnd = this.scrollEnd.bind(this);
    this.handleSelect = this.select.bind(this);
    this.handleChangePartner = this.changePartner.bind(this);
    this.handleCancelChangePartner = this.cancelChangePartner.bind(this);
  }

  scrollEnd(more: any) {
    more && more();
  }

  select(partner: IInputCompany) {
    this.setState({ open: false, visible: false, partner });
    this.props.onChangePartner && this.props.onChangePartner(partner);
  }

  cancelChangePartner() {
    this.setState({ visible: false });
  }

  changePartner() {
    this.setState({ visible: true });
  }

  renderPartner() {
    const { visible } = this.state;
    const partner: any = this.state.partner;

    let concatenedAddress: string | null = null;
    let address;
    if (partner && partner.addresses) {
      if (partner.addresses.rows && partner.addresses.rows[0]) {
        address = partner.addresses.rows[0];
      } else if (partner.addresses && partner.addresses[0]) {
        address = partner.addresses[0];
      }
    }

    if (address) {
      concatenedAddress = `${address.address1 ? `${address.address1} ` : ''}${
        address.zipcode ? `${address.zipcode} ` : ''
      }${address.city ? `${address.city} ` : ''}${
        address.country ? `${address.country}` : ''
      }`;
    }

    return partner ? (
      <Row
        style={{
          display: 'flex',
        }}
        className="form-partner-selected"
      >
        <Col
          style={{
            marginRight: '10px',
          }}
        >
          <CompanyAvatar company={partner} />
        </Col>
        <Col>
          <div className="partner-name">{partner.name}</div>
          <div className="partner-siret">{partner.siret}</div>
          <div className="partner-address">{concatenedAddress}</div>
        </Col>
        <Col>
          {visible ? (
            <Button
              className="cancel"
              onClick={this.handleCancelChangePartner}
              style={{
                color: '#F0455A',
                marginLeft: 10,
              }}
              type={BtnType.Ghost}
            >
              <FormattedMessage id="purchase.control.btn_cancel" />
            </Button>
          ) : (
            <Button
              onClick={this.handleChangePartner}
              style={{
                marginLeft: 10,
              }}
              type={BtnType.Ghost}
            >
              <FormattedMessage id="purchase.control.btn_change" />
            </Button>
          )}
        </Col>
      </Row>
    ) : null;
  }

  getDatasource(partners: any, siren: any): any {
    const { open, value } = this.state;
    if (!open) {
      return null;
    }

    let rows = null;

    if (value.length > 2 && siren && siren.data && siren.data.searchCompanies) {
      rows = siren.data.searchCompanies.rows;
    }

    if (!rows && partners && partners.data.partners) {
      rows = partners.data.partners.rows;
    }

    return rows;
  }

  isLoading(partners: any, siren: any): any {
    const loading = siren && siren.data && siren.data.loading;
    // let loading = partners && partners.data && partners.data.loading;
    return loading;
  }

  render() {
    const { intl, form } = this.props;
    const { value, visible } = this.state;

    return (
      <>
        {this.renderPartner()}
        {(visible || !this.state.partner) && (
          <AutocompleteSirenPartners
            placeholder="search.partner.search_placeholder"
            inline={true}
            type="invoices"
            rules={[
              {
                message: intl.formatMessage({
                  id: 'search.partner.error',
                }),
                required: true,
              },
            ]}
            form={form}
            onSelect={this.handleSelect}
          />
        )}
      </>
    );
  }
}

export default injectIntl(ControlPartner);
