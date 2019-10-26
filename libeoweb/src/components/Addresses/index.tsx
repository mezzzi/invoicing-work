import { Col, Row } from 'antd';
import { Icon } from 'components/Assets';
import { IconValue } from 'components/Assets/Icon';
import { FooterAdd } from 'components/Button';
import { H3 } from 'components/Typo';
import { Shadow } from 'components/Wrapper';
import { IAddress } from 'context/Addresses/types';
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import './Addresses.module.less';
import * as Context from './context';

interface IProps extends Context.InjectedProps {
  addresses?: IAddress[];
}
interface IState {}

class Addresses extends React.PureComponent<IProps, IState> {
  state = {};

  render() {
    const { addresses, editAddress } = this.props;
    const edit = editAddress && editAddress.edit;

    return (
      <Shadow className="company-addresses">
        <Row>
          <H3 className="uppercase">
            <FormattedMessage id="addresses.company.address_title" />
          </H3>
        </Row>
        <Row gutter={49}>
          {addresses &&
            addresses.map((address: IAddress, i: number) => (
              <Col className="company-address-col" key={`${i}`} span={8}>
                <div className="company-address-row-title">
                  <FormattedMessage
                    id="addresses.company.address_row_title"
                    values={{ count: i + 1 }}
                  />
                  <div
                    onClick={edit && edit.bind(this, address)}
                    className="company-address-row-edit"
                  >
                    <Icon value={IconValue.Pencil} />
                  </div>
                </div>
                <div className="company-address-row">
                  {address.address1 ? `${address.address1}` : ''}
                </div>
                <div className="company-address-row">
                  {address.address2 ? `${address.address2}` : ''}
                </div>
                <div className="company-address-row">
                  {address.zipcode ? `${address.zipcode} ` : ''}
                  {address.city ? `${address.city}` : ''}
                </div>
                <div className="company-address-row uppercase">
                  {address.country ? `${address.country}` : ''}
                </div>
                <div className="company-address-row">
                  {address.siret ? `${address.siret}` : ''}
                </div>
              </Col>
            ))}
        </Row>
        <Row>
          <FooterAdd onClick={edit && edit.bind(this, undefined)}>
            <FormattedMessage id="addresses.form.btn_add" />
          </FooterAdd>
        </Row>
      </Shadow>
    );
  }
}

export default Context.hoc()(Addresses);
