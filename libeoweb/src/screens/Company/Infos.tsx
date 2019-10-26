import { Form, Row } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import Addresses from 'components/Addresses';
import AddressForm from 'components/Addresses/AddressForm';
import * as EditAddressCtx from 'components/Addresses/context';
import { IconValue } from 'components/Assets/Icon';
import Detail from 'components/Company/Detail';
import Marketing from 'components/Company/Marketing';
import { Content, RightSideBar } from 'components/Layout';
import { Heading } from 'components/Typo';
import { IAddress } from 'context/Addresses/types';
import * as CompanyCtx from 'context/Company';
import { ICompany } from 'context/Company/types.d';
import * as User from 'context/User';
import { IUser } from 'context/User/types';
import * as React from 'react';
import { compose } from 'react-apollo';
import { InjectedIntlProps, injectIntl } from 'react-intl';
import { RouteComponentProps } from 'react-router';
import legalForm from 'utils/legal-form';
import './Infos.module.less';

interface IProps
  extends RouteComponentProps,
    FormComponentProps,
    InjectedIntlProps,
    User.InjectedProps {}

interface IState {
  legalForms: any;
}

class Bank extends React.PureComponent<IProps, IState> {
  state = {
    legalForms: {},
  };

  close = (addressDone?: () => void) => {
    addressDone && addressDone();
  };

  async componentDidMount() {
    const legalForms = await legalForm.all();
    this.setState({ legalForms });
  }

  render() {
    const { user } = this.props;
    const me: IUser = user && user.data && user.data.me;

    const currentCompany: ICompany = me && me.currentCompany;

    const addresses: IAddress[] =
      (currentCompany &&
        currentCompany.addresses &&
        currentCompany.addresses.rows) ||
      [];

    return (
      <EditAddressCtx.Provider>
        <EditAddressCtx.Consumer>
          {({ editAddress }) => (
            <RightSideBar
              closable={true}
              onClose={this.close.bind(null, editAddress && editAddress.done)}
              sidebar={
                editAddress &&
                editAddress.editing && (
                  <AddressForm
                    onUpdate={user && user.data && user.data.refetch}
                    companyId={currentCompany.id}
                  />
                )
              }
            >
              <Content>
                <Row type="flex">
                  <Heading
                    icon={IconValue.Wallet}
                    title={'infos.header.title'}
                    description={'infos.header.description'}
                  />
                </Row>
                <Detail company={currentCompany} />
                {currentCompany && (
                  <>
                    <Row>
                      <CompanyCtx.Provider>
                        <CompanyCtx.Consumer>
                          {({ company }) => (
                            <Marketing
                              company={currentCompany}
                              update={company && company.create}
                            />
                          )}
                        </CompanyCtx.Consumer>
                      </CompanyCtx.Provider>
                    </Row>
                    <Row>
                      <Addresses addresses={addresses} />
                    </Row>
                  </>
                )}
              </Content>
            </RightSideBar>
          )}
        </EditAddressCtx.Consumer>
      </EditAddressCtx.Provider>
    );
  }
}

export default compose(
  Form.create({}),
  injectIntl,
  User.hoc(),
)(Bank);
