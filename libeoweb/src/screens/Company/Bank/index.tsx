import { PrivateRoute } from 'components/Route';
import * as BankCtx from 'context/Bank';
import { IBankAccount, IMandate, MandateStatus } from 'context/Bank/types';
import * as User from 'context/User';
import * as React from 'react';
import { compose } from 'react-apollo';
import { Redirect, RouteComponentProps, withRouter } from 'react-router';
import './Bank.module.less';

const Bank = React.lazy(() => import('./Bank'));
const BankAdd = React.lazy(() => import('./BankAdd'));
const BankProvisionning = React.lazy(() => import('./BankProvisionning'));
const Mandate = React.lazy(() => import('./Mandate'));
const MandateAdd = React.lazy(() => import('./MandateAdd'));

interface IProps extends User.InjectedProps, RouteComponentProps {}

const BankRoute: React.FunctionComponent<IProps> = ({ location }) => {
  const isAutoLoad = location.state && location.state.action === 'autoload';

  if (isAutoLoad) {
    // if user clicked on DialogTransfert
    return (
      <BankCtx.Provider list>
        <BankCtx.Consumer>
          {({ bank }) => {
            const bankAccounts =
              bank && bank.bankAccounts && bank.bankAccounts.bankAccounts;

            if (bankAccounts) {
              if (bankAccounts.rows.length === 0) {
                // if user doesn't have any bank account
                return <Redirect to="/company/bank/add" />;
              } else {
                // redirect to mandate create or sign
                const defaultBankAccount = bankAccounts.rows.find(
                  (bankAccount: IBankAccount) => bankAccount.enabled,
                );
                if (!defaultBankAccount) {
                  // if user had bank account but disabled it
                  return <Redirect to="/company/bank/add" />;
                } else {
                  if (
                    !defaultBankAccount.mandates ||
                    defaultBankAccount.mandates.length === 0
                  ) {
                    return (
                      <Redirect
                        to={`/company/bank/mandate/add/${
                          defaultBankAccount.id
                        }`}
                      />
                    );
                  } else {
                    return (
                      <Redirect
                        to={`/company/bank/mandate/view/${
                          defaultBankAccount.id
                        }`}
                      />
                    );
                  }
                }
              }
            }

            return undefined;
          }}
        </BankCtx.Consumer>
      </BankCtx.Provider>
    );
  }

  return (
    <BankCtx.Provider list>
      <>
        <PrivateRoute
          path="/company/bank"
          exact
          component={Bank}
          layout={{
            subSidebar: true,
          }}
        />
        <PrivateRoute
          path="/company/bank/add"
          component={BankAdd}
          layout={{
            subSidebar: true,
          }}
        />
        <PrivateRoute
          path="/company/bank/edit/:id"
          component={BankAdd}
          layout={{
            subSidebar: true,
          }}
        />
        <PrivateRoute
          path="/company/bank/provisionning"
          component={BankProvisionning}
          layout={{
            subSidebar: true,
          }}
        />
        <PrivateRoute
          path="/company/bank/mandate/add/:bankId"
          component={MandateAdd}
          layout={{
            subSidebar: true,
          }}
        />
        <PrivateRoute
          path="/company/bank/mandate/edit/:bankId"
          component={MandateAdd}
          layout={{
            subSidebar: true,
          }}
        />
        <PrivateRoute
          path="/company/bank/mandate/view/:bankId"
          component={Mandate}
          layout={{
            subSidebar: true,
          }}
        />
      </>
    </BankCtx.Provider>
  );
};

export default compose(
  User.hoc(),
  withRouter,
)(BankRoute);
