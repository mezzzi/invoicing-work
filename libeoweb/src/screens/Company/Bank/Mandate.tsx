import { Col, Form, Row } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import { Icon } from 'components/Assets';
import { IconValue } from 'components/Assets/Icon';
import { BtnType, Button } from 'components/Button';
import { Card } from 'components/Card';
import { DialogCode, DialogMandateRemove } from 'components/Dialog';
import { Text } from 'components/Form';
import ControlIban from 'components/Form/ControlIban';
import { Content, FloatingActionFooter } from 'components/Layout';
import { A, Div, H3, Heading } from 'components/Typo';
import { IAddress } from 'context/Addresses/types';
import * as BankCtx from 'context/Bank';
import { IMandate, MandateStatus } from 'context/Bank/types';
import { ICompany } from 'context/Company/types.d';
import * as Iban from 'context/Iban';
import * as User from 'context/User';
import { IUser } from 'context/User/types';
import moment from 'moment';
import * as React from 'react';
import { compose } from 'react-apollo';
import { FormattedMessage, InjectedIntlProps, injectIntl } from 'react-intl';
import { RouteComponentProps } from 'react-router';
import { Link } from 'react-router-dom';
import history from 'store/history';
import { staticAssets } from 'utils/common';
import MandateCode from './components/MandateCode';

interface IProps extends RouteComponentProps, User.InjectedProps {}

interface IState {
  modalVisible: boolean;
  modalRemoveVisible: boolean;
}

const Mandate: React.FunctionComponent<IProps> = ({ match, user }) => {
  const bankId = match && match.params && (match.params as any).bankId;
  const me: IUser = user && user.data && user.data.me;
  const currentCompany: ICompany | undefined = me && me.currentCompany;
  const addresses: IAddress | undefined =
    currentCompany &&
    currentCompany.addresses &&
    currentCompany.addresses.rows &&
    currentCompany.addresses.rows[0];

  const id = match && match.params && (match.params as any).id;

  const [modalVisible, setModalVisible] = React.useState(false);
  const [modalRemoveVisible, setModalRemoveVisible] = React.useState(false);
  const [mandateId, setMandateId] = React.useState(id);

  const later = () => {
    history.push('/company/bank');
  };

  const onFinish = () => {
    setModalVisible(false);
  };

  const showModalRemove = () => {
    setModalRemoveVisible(true);
  };

  const cancelRemove = () => {
    setModalRemoveVisible(false);
  };

  const openModal = (e?: React.FormEvent) => {
    e && e.preventDefault();
    setModalVisible(true);
  };

  return (
    <Content className="mandate">
      <Row type="flex">
        <Heading
          icon={IconValue.Wallet}
          title={'bank.mandate_view.title'}
          description={'bank.mandate_view.description'}
        />
      </Row>
      {currentCompany && (
        <BankCtx.Provider id={bankId}>
          <BankCtx.Consumer>
            {({ bank }) => {
              const removeMandate = bank && bank.removeMandate;
              const generateCode = bank && bank.generateCode;
              const sign = bank && bank.sign;

              const current =
                bank && bank.bankAccount && bank.bankAccount.bankAccount;
              const refetch =
                bank && bank.bankAccount && bank.bankAccount.refetch;

              const mandate: IMandate | undefined =
                current &&
                current.mandates &&
                current.mandates.find(
                  (currentMandate: IMandate) =>
                    currentMandate.status !== MandateStatus.Canceled,
                );

              const remove = async () => {
                if (removeMandate && mandate) {
                  const success = await removeMandate(`${mandate.id}`);
                  if (success) {
                    history.push('/company/bank');
                  } else {
                    setModalRemoveVisible(false);
                  }
                }
              };

              return (
                mandate && (
                  <>
                    {modalVisible && (
                      <MandateCode
                        bankId={bankId}
                        id={mandate.id}
                        sign={sign}
                        refetch={refetch}
                        generateCode={generateCode}
                        onFinish={onFinish}
                      />
                    )}
                    {modalRemoveVisible && (
                      <DialogMandateRemove
                        onRemove={remove}
                        onCancel={cancelRemove}
                        visible={modalRemoveVisible}
                      />
                    )}
                    <Card primary center={false}>
                      <Row type="flex">
                        <H3
                          style={{
                            flex: 1,
                          }}
                        >
                          <FormattedMessage id="bank.mandate_view_detail.title" />
                        </H3>
                        <Row>
                          <div className="row-title">
                            <FormattedMessage id="bank.mandate_view_detail.date" />
                          </div>
                          <div className="row-detail">
                            {mandate &&
                              moment(mandate.createdAt).format('DD/MM/YYYY')}
                          </div>
                        </Row>
                      </Row>
                      <Row gutter={28}>
                        <Col span={12}>
                          <H3
                            css={{
                              primaryColor: true,
                              uppercase: true,
                            }}
                          >
                            <FormattedMessage id="bank.mandate_view_detail.debtor" />
                          </H3>
                          <div className="row-detail">
                            {me.firstname} {me.lastname}
                          </div>
                          {addresses && (
                            <>
                              <div className="row-detail">
                                {addresses.address1}
                              </div>
                              <div className="row-detail">
                                {addresses.zipcode}, {addresses.city}
                              </div>
                            </>
                          )}
                          {current && (
                            <>
                              {current.iban && (
                                <>
                                  <div className="row-title">
                                    <FormattedMessage id="bank.mandate_view_detail.iban" />
                                  </div>
                                  <div className="row-detail">
                                    {current.iban.iban}
                                  </div>
                                  <div className="row-title">
                                    <FormattedMessage id="bank.mandate_view_detail.bic" />
                                  </div>
                                  <div className="row-detail">
                                    {current.iban.bic}
                                  </div>
                                  <div className="row-title">
                                    <FormattedMessage id="bank.mandate_view_detail.bank" />
                                  </div>
                                  <div className="row-detail">
                                    {current.iban.bank}
                                  </div>
                                </>
                              )}
                            </>
                          )}
                        </Col>
                        <Col span={12}>
                          <H3
                            css={{
                              primaryColor: true,
                              uppercase: true,
                            }}
                          >
                            <FormattedMessage id="bank.mandate_view_detail.créditor" />
                          </H3>
                          <div className="row-detail">
                            <FormattedMessage id="bank.mandate_view_detail.debtor_company" />
                          </div>
                          <div className="row-detail">
                            <FormattedMessage id="bank.mandate_view_detail.debtor_address1" />
                          </div>
                          <div className="row-detail">
                            <FormattedMessage id="bank.mandate_view_detail.debtor_zipcode" />
                            ,&nbsp;
                            <FormattedMessage id="bank.mandate_view_detail.debtor_city" />
                          </div>
                          <div className="row-title">
                            <FormattedMessage id="bank.mandate_view_detail.id_creditor" />
                          </div>
                          <div className="row-detail">
                            <FormattedMessage id="bank.mandate_view_detail.debtor_id" />
                          </div>
                          {mandate && <A>{mandate.rum}</A>}
                        </Col>
                      </Row>
                      <div className="row-mandate-explain">
                        <FormattedMessage id="bank.mandate_view_detail.description" />
                      </div>
                    </Card>
                    <FloatingActionFooter visible={true}>
                      {mandate.status === MandateStatus.Signed && (
                        <>
                          <Button
                            style={{
                              marginLeft: 150,
                              marginRight: 50,
                            }}
                            onClick={showModalRemove}
                            type={BtnType.Default}
                          >
                            <FormattedMessage id="bank.mandate_view_footer.remove" />
                          </Button>
                          <span
                            style={{
                              marginLeft: 'auto',
                              marginRight: 50,
                            }}
                            className="ant-btn ant-btn-primary"
                          >
                            <Link to="/company/bank">
                              <FormattedMessage id="bank.mandate_view_footer.later" />
                            </Link>
                          </span>
                        </>
                      )}
                      {mandate.status !== MandateStatus.Signed && (
                        <Button
                          style={{
                            marginLeft: 'auto',
                            marginRight: 50,
                          }}
                          onClick={openModal}
                          type={BtnType.Primary}
                        >
                          <FormattedMessage id="bank.mandate_view_footer.sign" />
                        </Button>
                      )}
                    </FloatingActionFooter>
                  </>
                )
              );
            }}
          </BankCtx.Consumer>
        </BankCtx.Provider>
      )}
    </Content>
  );
};

export default compose(
  injectIntl,
  User.hoc(),
  Form.create({}),
)(Mandate);
