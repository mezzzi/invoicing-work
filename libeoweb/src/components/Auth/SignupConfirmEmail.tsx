import hello from '-!svg-react-loader!assets/images/undraw_hello_aeia.svg';
import { Form } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import { Alert } from 'components/Alert';
import { Email, Submit } from 'components/Form';
import * as AlertCtx from 'context/Alert';
import * as Auth from 'context/Auth';
import * as React from 'react';
import { compose } from 'react-apollo';
import {
  FormattedHTMLMessage,
  FormattedMessage,
  InjectedIntlProps,
  injectIntl,
} from 'react-intl';
import { Wrapper } from '.';
const Hello: any = hello;

interface IProps
  extends FormComponentProps,
    InjectedIntlProps,
    Auth.InjectedProps,
    AlertCtx.InjectedProps {
  hash?: string;
}

interface IState {}

class SignupConfirmEmail extends React.PureComponent<IProps, IState> {
  state = {};

  handleSubmit: (e: React.FormEvent) => void;

  constructor(props: any) {
    super(props);

    this.handleSubmit = this.submit.bind(this);
  }

  submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { hash } = this.props;
    this.props.form.validateFields(async (err, values) => {
      if (!err) {
        if (this.props.auth) {
          await (this.props.auth &&
            this.props.auth.resendActivate(values.email));
        }
      }
    });
  };

  render() {
    const { form, intl, alert } = this.props;
    const errors = alert && alert.errors;

    return (
      <Wrapper img={<Hello />} title="signup.activate.title">
        {errors &&
          errors.map((error, i) => (
            <Alert
              key={`${i}`}
              alertItem={error}
              message={
                error.message && <FormattedHTMLMessage id={error.message} />
              }
              type="error"
            />
          ))}
        <Form className="form-signup-activate" onSubmit={this.handleSubmit}>
          <Email
            id="email"
            label={<FormattedMessage id="signup.activate.email" />}
            rules={[
              {
                message: intl.formatMessage({ id: 'signin.form.email_error' }),
                pattern: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                required: true,
              },
            ]}
            form={form}
          />
          <Submit
            className="signin-submit"
            label={{ id: 'signup.activate.submit' }}
          />
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
)(SignupConfirmEmail);
