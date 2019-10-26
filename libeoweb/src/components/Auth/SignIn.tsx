import { Form } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import { Alert } from 'components/Alert';
import { Email, Submit } from 'components/Form';
import * as AlertCtx from 'context/Alert';
import { IAlertType } from 'context/Alert/types';
import * as Auth from 'context/Auth';
import * as React from 'react';
import { compose } from 'react-apollo';
import {
  FormattedHTMLMessage,
  FormattedMessage,
  InjectedIntlProps,
  injectIntl,
} from 'react-intl';
import { NavLink } from 'react-router-dom';
import { Wrapper } from '.';
import Icon, { IconValue } from '../Assets/Icon';
import { A } from '../Typo';
import { Password } from './Inputs/Password';
import { extractEmailFromURL } from './utils/urlParametersExtractor';

interface IProps
  extends FormComponentProps,
    InjectedIntlProps,
    Auth.InjectedProps,
    AlertCtx.InjectedProps {
  hash?: string;
}

interface IState {
  error?: string;
  info?: string;
}

class SignupForm extends React.PureComponent<IProps, IState> {
  state = {
    error: undefined,
    info: undefined,
  };

  handleSubmit: (e: React.FormEvent) => void;

  constructor(props: any) {
    super(props);

    this.handleSubmit = this.submit.bind(this);
  }

  submit = async (e: React.FormEvent) => {
    e.preventDefault();
    this.props.form.validateFields(async (err, values) => {
      if (!err) {
        if (this.props.auth) {
          this.setState({ error: undefined });

          const error = await (this.props.auth.signin &&
            this.props.auth.signin(values));
          this.setState({ error });
        }
      }
    });
  };

  componentWillUnmount() {
    const { alert } = this.props;
    alert && alert.reset && alert.reset();
  }

  async componentDidMount() {
    const { hash } = this.props;
    if (hash) {
      await ((this.props.auth && this.props.auth.activate(hash)) || false);
    }
  }

  resend = async () => {
    this.props.form.validateFields(async (err, values) => {
      if (!err) {
        if (this.props.auth) {
          this.setState({ error: undefined });
          await (this.props.auth &&
            this.props.auth.resendActivate(values.email));

          this.setState({ info: 'signin.form.check_your_email' });
        }
      }
    });
  };

  render() {
    const { form, intl, hash } = this.props;
    const { error, info } = this.state;

    let alert: any;
    if (error) {
      alert = (
        <Alert
          background={false}
          alertItem={{
            dismiss: false,
            id: `${error}`,
            message: `${error}`,
            type: IAlertType.Error,
          }}
          message={error && <FormattedHTMLMessage id={error} />}
          type="error"
        />
      );

      if (error === 'api.error.user.disabled') {
        alert = (
          <div
            style={{
              cursor: 'pointer',
            }}
            onClick={this.resend}
          >
            {alert}
          </div>
        );
      }
    }

    const defaultEmail = extractEmailFromURL();
    return (
      <Wrapper img={<Icon value={IconValue.Hello} />} title="signin.title">
        {hash && <FormattedMessage id="signin.form.login_to_validate_token" />}
        {alert}
        {info && (
          <Alert
            background={false}
            alertItem={{
              dismiss: false,
              id: `${info}`,
              message: `${info}`,
              type: IAlertType.Success,
            }}
            message={info && <FormattedHTMLMessage id={info} />}
            type="success"
          />
        )}
        <Form id="form-signin" onSubmit={this.handleSubmit}>
          <Email
            validateTrigger="onSubmit"
            defaultValue={defaultEmail}
            id="email"
            label={<FormattedMessage id="signin.form.email" />}
            rules={[
              {
                message: intl.formatMessage({ id: 'signin.form.email_error' }),
                required: true,
                type: 'email',
              },
            ]}
            form={form}
          />
          <Password form={form} />
          <div className="signup-submit-container">
            <Submit
              className="signin-submit"
              label={{ id: 'signin.form.submit' }}
            />
            <NavLink to="/reset-password-request">
              <A tag="span">
                <FormattedMessage id="signin.reset_password" />
              </A>
            </NavLink>
          </div>
        </Form>
      </Wrapper>
    );
  }
}

export default compose(
  Form.create({}),
  injectIntl,
  Auth.hoc(),
  AlertCtx.hoc(),
)(SignupForm);
