import emailSignup from '-!svg-react-loader!assets/images/email-signup.svg';
import { P } from 'components/Typo';
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { Wrapper } from '.';
const EmailSignup: any = emailSignup;

interface IProps {}

interface IState {}

class SignupSuccess extends React.PureComponent<IProps, IState> {
  state = {};

  render() {
    return (
      <Wrapper
        img={<EmailSignup />}
        className="signup-success"
        title="signup.form.check_your_email_title"
      >
        <P>
          <FormattedMessage id="signup.form.check_your_email_description" />
        </P>
      </Wrapper>
    );
  }
}

export default SignupSuccess;
