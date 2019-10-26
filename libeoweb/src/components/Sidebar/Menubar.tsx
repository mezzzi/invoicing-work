import { IconValue } from 'components/Assets/Icon';
import * as Auth from 'context/Auth';
import * as BalanceCtx from 'context/Balance';
import { ICompany } from 'context/Company/types.d';
import * as User from 'context/User';
import * as React from 'react';
import { compose } from 'react-apollo';
import { FormattedMessage, FormattedNumber } from 'react-intl';
import './Menubar.module.less';
const Sidebar = React.lazy(() => import('./Sidebar'));

interface IProps extends Auth.InjectedProps, User.InjectedProps {}

const Menubar: React.FunctionComponent<IProps> = ({ user, auth }) => {
  const companies =
    user &&
    user.data &&
    user.data.me &&
    user.data.me.companies &&
    user.data.me.companies.rows;

  const signout = async () => {
    if (auth && auth.signout) {
      await auth.signout();
    }
  };

  return (
    <div
      className="sidebar-wrapper sub-sidebar-wrapper"
      style={{
        display: 'flex',
        flexDirection: 'row',
      }}
    >
      <React.Suspense
        fallback={
          <div className="sidebar menu-bar">
            <ul className="ant-menu ant-menu-inline" />
          </div>
        }
      >
        <Sidebar
          name="menu"
          className="menu-bar"
          collapsable={false}
          contrast
          items={[
            {
              dividerAfter: true,
              key: 'balance',
              right: (
                <BalanceCtx.Provider balance>
                  <BalanceCtx.Consumer>
                    {({ balance }) => {
                      return (
                        <FormattedNumber
                          style="currency"
                          currency={'EUR'}
                          value={
                            balance && balance.data && balance.data.balance
                              ? balance.data.balance.currentBalance
                              : 0
                          }
                        />
                      );
                    }}
                  </BalanceCtx.Consumer>
                </BalanceCtx.Provider>
              ),
              title: (
                <span className="header-balance">
                  <FormattedMessage id="header.menu.balance" />
                </span>
              ),
            },
            {
              icon: IconValue.Profile,
              items: [
                {
                  key: 'informations',
                  title: 'header.menu.profile_informations',
                },
                {
                  disabled: true,
                  key: 'contacts',
                  title: 'header.menu.profile_contacts',
                },
                {
                  disabled: true,
                  key: 'notifications',
                  title: 'header.menu.profile_notifications',
                },
              ],
              key: 'profile',
              title: 'header.menu.profile',
            },
            {
              icon: IconValue.Briefcase,
              items: [
                {
                  key: 'informations',
                  title: 'header.menu.company_informations',
                },
                {
                  disabled: true,
                  key: 'proof',
                  title: 'header.menu.company_proof',
                },
                {
                  key: 'bank',
                  title: 'header.menu.company_bank',
                },
                {
                  disabled: true,
                  key: 'collaborators',
                  title: 'header.menu.company_collaborators',
                },
                {
                  key: 'accounting',
                  title: 'header.menu.company_accounting',
                },
              ],
              key: 'company',
              title: 'header.menu.company',
            },
            {
              disabled: true,
              icon: IconValue.Change,
              items:
                companies &&
                companies.map((company: ICompany) => ({
                  key: company.id,
                  title: company.name || company.brandName,
                })),
              key: 'switch_company',
              title: 'header.menu.switch_company',
            },
            {
              disabled: true,
              dividerBefore: true,
              icon: IconValue.Share,
              key: 'share',
              title: 'header.menu.share',
            },
            {
              disabled: true,
              icon: IconValue.Help,
              key: 'help',
              title: 'header.menu.help',
            },
            {
              icon: IconValue.Blog,
              key: 'logout',
              onClick: signout,
              reverse: true,
              title: 'header.menu.logout',
            },
          ]}
        />
      </React.Suspense>
    </div>
  );
};

export default compose(
  User.hoc(),
  Auth.hoc(),
)(Menubar);
