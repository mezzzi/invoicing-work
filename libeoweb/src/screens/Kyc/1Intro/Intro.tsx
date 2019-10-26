import img from 'assets/images/kyc-1.svg';
import { BtnType, Button } from 'components/Button';
import { Heading } from 'components/Typo';
import * as User from 'context/User';
import * as React from 'react';
import { compose } from 'react-apollo';
import { FormattedMessage } from 'react-intl';
import * as KycCtx from '../context';
import Manager, { IManagerProps, IManagerState } from '../Manager';
const Img: any = img;

interface IProps extends IManagerProps, User.InjectedProps {}
interface IState extends IManagerState {}

class Intro extends Manager<IProps, IState> {
  state = {};

  render() {
    return (
      <div className="transition-intro">
        <div
          style={{
            marginBottom: 40,
          }}
        >
          <Heading small center title="kyc.intro.title" />
        </div>
        <Button
          to="/kyc/company"
          type={BtnType.Primary}
          center
          style={{
            marginBottom: 40,
          }}
        >
          <FormattedMessage id="kyc.intro.btn" />
        </Button>
        <Img />
      </div>
    );
  }
}

export default compose(KycCtx.hoc())(Intro);
