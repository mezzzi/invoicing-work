import { Content } from 'components/Layout';
import * as Company from 'context/Company';
import * as User from 'context/User';
import * as React from 'react';
import { compose } from 'react-apollo';
import { RouteComponentProps, withRouter } from 'react-router';
import BottomBar from './BottomBar';
import './Kyc.module.less';
import Sidebar from './Sidebar';

interface IProps extends User.InjectedProps, RouteComponentProps {}
interface IState {}

class Kyc extends React.PureComponent<IProps, IState> {
  state = {};

  render() {
    const { children, user } = this.props;
    const currentCompany = user && user.data && user.data.currentCompany;

    const match: any = this.props.match;
    const step: any =
      match.params && match.params.step ? match.params.step : 'intro';

    return (
      <Content
        style={{
          padding: 0,
        }}
        reverse={step === 'intro' || step === 'iban'}
      >
        <div className="kyc-outter">
          <div className={`kyc-wrapper kyc-${step}`}>
            <Company.Provider>{children}</Company.Provider>
          </div>
          <Sidebar current={step} />
        </div>
        <BottomBar />
      </Content>
    );
  }
}

export default compose(
  User.hoc(),
  withRouter,
)(Kyc);
