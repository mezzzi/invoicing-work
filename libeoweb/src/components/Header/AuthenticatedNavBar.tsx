import { Card, Popover, Row } from 'antd';
import * as User from 'context/User';
import * as React from 'react';

import { Icon } from 'components/Assets';
import { IconValue } from 'components/Assets/Icon';
import CompanyAvatar from 'components/Avatar/CompanyAvatar';
import Menubar from 'components/Sidebar/Menubar';
import { compose } from 'react-apollo';
import history from 'store/history';

const { Meta } = Card;

interface IProps extends User.InjectedProps {}

const AuthenticatedNavBar: React.FunctionComponent<IProps> = ({ user }) => {
  const [visible, setVisible] = React.useState<boolean>(false);

  const popupContainer = () => {
    const el: HTMLElement | null = document.querySelector('.header-card');
    if (el) {
      return el;
    }
    return document.body;
  };

  React.useEffect(() => {
    history.listen(() => {
      setVisible(false);
    });
  }, []);

  const toggle = (newVisiblilty: boolean) => {
    setVisible(newVisiblilty);
  };

  const me = user && user.data && user.data.me;
  const currentCompany =
    user && user.data && user.data.me && user.data.me.currentCompany;

  if (me) {
    return (
      <Row type="flex" justify="space-between" align="middle">
        <div id="search-box" style={{ flex: 1 }} />
        <Popover
          trigger="click"
          onVisibleChange={toggle}
          visible={visible}
          content={<Menubar />}
          placement="bottomRight"
          getPopupContainer={popupContainer}
        >
          <Card
            className="header-card"
            bordered={false}
            bodyStyle={{ padding: 0 }}
          >
            <Meta
              avatar={<CompanyAvatar company={currentCompany} />}
              title={
                <div>
                  {me.firstname} {me.lastname}
                  <div className="header-company-name">
                    {currentCompany && currentCompany.name}
                  </div>
                </div>
              }
            />
          </Card>
          <Icon
            value={IconValue.ChevronDown}
            style={{
              height: '20px',
              position: 'absolute',
              right: 0,
              top: '50%',
              transform: 'translate(0, -50%)',
              width: '15px',
            }}
          />
        </Popover>
      </Row>
    );
  }
  return null;
};

export default compose(User.hoc())(AuthenticatedNavBar);
