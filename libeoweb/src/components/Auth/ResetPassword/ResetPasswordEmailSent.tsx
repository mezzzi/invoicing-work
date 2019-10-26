import emailSignup from '-!svg-react-loader!assets/images/email-signup.svg';
import { P } from 'components/Typo';
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { Wrapper } from '../';
const EmailSignup: any = emailSignup;

interface IProps {}

interface IState {}

class ResetPasswordEmailSent extends React.PureComponent<IProps, IState> {
  state = {};

  render() {
    return (
      <Wrapper img={<EmailSignup />} title="reset_password_request.email_sent">
        <P>
          <FormattedMessage id="reset_password_request.check_email" />
        </P>
      </Wrapper>
    );
  }
}

export default ResetPasswordEmailSent;
