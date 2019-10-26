import { Form, Row } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import { IconValue } from 'components/Assets/Icon';
import { BtnType, Button } from 'components/Button';
import { Content, FloatingActionFooter } from 'components/Layout';
import { Heading } from 'components/Typo';
import * as BankCtx from 'context/Bank';
import * as User from 'context/User';
import * as React from 'react';
import { compose } from 'react-apollo';
import { FormattedMessage, InjectedIntlProps, injectIntl } from 'react-intl';
import { RouteComponentProps } from 'react-router';
import history from 'store/history';
import Mandatecode from './components/MandateCode';
import MandateForm from './components/MandateForm';

interface IProps
  extends RouteComponentProps,
    FormComponentProps,
    InjectedIntlProps,
    User.InjectedProps {}

const MandateAdd: React.FunctionComponent<IProps> = ({ match }) => {
  const bankId = match && match.params && (match.params as any).bankId;
  const id = match && match.params && (match.params as any).id;

  const [modalVisible, setModalVisible] = React.useState(false);
  const [mandateId, setMandateId] = React.useState(id);

  const later = () => {
    history.push('/company/bank');
  };

  const onFinish = () => {
    setModalVisible(false);
  };

  return (
    <Content>
      <Row type="flex">
        <Heading
          icon={IconValue.Wallet}
          title={'bank.mandate_add.title'}
          description={
            top.location.href.indexOf('?bank') > -1
              ? 'bank.mandate_add.save_and_description'
              : 'bank.mandate_add.description'
          }
        />
      </Row>
      <BankCtx.Provider id={bankId}>
        <BankCtx.Consumer>
          {({ bank }) => {
            const createMandate = bank && bank.createMandate;
            const generateCode = bank && bank.generateCode;
            const sign = bank && bank.sign;

            const current =
              bank && bank.bankAccount && bank.bankAccount.bankAccount;
            const refetch =
              bank && bank.bankAccount && bank.bankAccount.refetch;

            const submit = async (e?: React.FormEvent) => {
              e && e.preventDefault();

              if (bankId && createMandate) {
                const mandate = await createMandate(bankId);

                if (mandate) {
                  setMandateId(mandate.id);
                  setModalVisible(true);
                }
              }
            };

            return (
              <>
                {modalVisible && mandateId && (
                  <Mandatecode
                    bankId={bankId}
                    id={mandateId}
                    sign={sign}
                    refetch={refetch}
                    generateCode={generateCode}
                    onFinish={onFinish}
                  />
                )}
                <MandateForm bank={current} onSubmit={onsubmit} />
                <FloatingActionFooter
                  style={{
                    justifyContent: 'flex-end',
                  }}
                  visible={true}
                >
                  <Button
                    onClick={later}
                    style={{
                      marginRight: 50,
                    }}
                    type={BtnType.Default}
                  >
                    <FormattedMessage id="bank.mandate.later" />
                  </Button>
                  <Button
                    onClick={submit}
                    style={{ marginRight: 50 }}
                    type={BtnType.Primary}
                  >
                    <FormattedMessage id="bank.mandate.submit" />
                  </Button>
                </FloatingActionFooter>
              </>
            );
          }}
        </BankCtx.Consumer>
      </BankCtx.Provider>
    </Content>
  );
};

export default compose(
  injectIntl,
  User.hoc(),
  Form.create({}),
)(MandateAdd);
