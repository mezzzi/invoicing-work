import { Row } from 'antd';
import { Icon } from 'components/Assets';
import { IconValue } from 'components/Assets/Icon';
import { Content } from 'components/Layout';
import 'components/Table/Table.module.less';
import { A, Heading } from 'components/Typo';
import * as BankCtx from 'context/Bank';
import * as React from 'react';
import { compose } from 'react-apollo';
import { FormattedMessage, InjectedIntlProps, injectIntl } from 'react-intl';
import { RouteComponentProps } from 'react-router';
import { NavLink } from 'react-router-dom';
import BankList from './components/BankList';

interface IProps
  extends RouteComponentProps,
    InjectedIntlProps,
    BankCtx.InjectedProps {}

const Bank: React.FunctionComponent<IProps> = ({ bank }) => {
  const removeBankAccount = bank && bank.removeBankAccount;
  const changeDefaultBankAccount = bank && bank.changeDefaultBankAccount;

  const loading = bank && bank.bankAccounts && bank.bankAccounts.loading;

  const defaultBankAccount =
    bank &&
    bank.bankAccounts &&
    bank.bankAccounts.bankAccounts &&
    bank.bankAccounts.bankAccounts.rows &&
    bank.bankAccounts.bankAccounts.rows.find((bankAccount: any) =>
      bankAccount.default ? bankAccount.id : false,
    );

  let filtered: any[] = [];
  if (
    bank &&
    bank.bankAccounts &&
    bank.bankAccounts.bankAccounts &&
    bank.bankAccounts.bankAccounts.rows
  ) {
    filtered = bank.bankAccounts.bankAccounts.rows.filter(
      (row: any) => row.enabled === true,
    );
  }

  const onChangeDefaultBank = async (id: string) => {
    if (id && changeDefaultBankAccount) {
      await changeDefaultBankAccount(id);
    }
  };

  const onRemove = async (id: string) => {
    if (removeBankAccount) {
      await removeBankAccount(id);
    }
  };

  return (
    <Content>
      <Row type="flex">
        <Heading
          icon={IconValue.Wallet}
          title={'bank.header.title'}
          description={'bank.header.description'}
          right={
            <NavLink
              style={{
                alignItems: 'flex-end',
                display: 'flex',
                marginBottom: 10,
              }}
              to="/company/bank/provisionning"
            >
              {/* TODO: FEATURE-AUTOLOAD
              <A tag="div">
                <Icon value={IconValue.Gear} />
                <FormattedMessage id="bank.provisionning.link" />
              </A> */}
            </NavLink>
          }
        />
      </Row>
      {filtered && (
        <BankList
          loading={loading}
          defaultBankAccount={defaultBankAccount}
          bankAccounts={filtered}
          onChangeDefaultBankAccount={onChangeDefaultBank}
          onRemove={onRemove}
        />
      )}
    </Content>
  );
};

export default compose(
  injectIntl,
  BankCtx.hoc(),
)(Bank);
