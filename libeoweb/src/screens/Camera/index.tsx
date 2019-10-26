import * as Auth from 'context/Auth';
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { RouteComponentProps } from 'react-router';
import './Camera.module.less';

interface IProps extends RouteComponentProps, Auth.InjectedProps {}

class TestSuccessScreen extends React.PureComponent<IProps> {
  state = {};

  handleSignout: () => void;

  constructor(props: any) {
    super(props);
    this.handleSignout = this.signout.bind(this);
  }

  async signout() {
    await (this.props.auth &&
      this.props.auth.signout &&
      this.props.auth.signout());
  }

  render() {
    return (
      <div onClick={this.handleSignout} className="camera-signout">
        <FormattedMessage id="camera.footer.signout" />
      </div>
    );
  }
}

export default Auth.hoc()(TestSuccessScreen);
