import hello from '-!svg-react-loader!assets/images/undraw_hello_aeia.svg';
import { Col, Form, Row } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import { Alert } from 'components/Alert';
import {
  AbstractPassword,
  Checkbox,
  Email,
  Submit,
  Text,
} from 'components/Form';
import * as AlertCtx from 'context/Alert';
import * as Auth from 'context/Auth';
import * as React from 'react';
import { compose } from 'react-apollo';
import { FormattedMessage, InjectedIntlProps, injectIntl } from 'react-intl';
import { Wrapper } from '.';
import { ConfirmPassword } from './Inputs/ConfirmPassword';
import { Password } from './Inputs/Password';
import { PASSWORD_PATTERN } from './rules';
const Hello: any = hello;

interface IProps
  extends FormComponentProps,
    InjectedIntlProps,
    Auth.InjectedProps,
    AlertCtx.InjectedProps {}

class SignupForm extends React.PureComponent<IProps> {
  handleSubmit: (e: React.FormEvent) => void;

  constructor(props: any) {
    super(props);

    this.handleSubmit = this.submit.bind(this);
  }

  submit = async (e: React.FormEvent) => {
    e.preventDefault();
    this.props.form.validateFields(async (err, values) => {
      if (!err) {
        delete values.offers;
        values.passwordConfirmation = values['confirm-password'];
        delete values['confirm-password'];
        await (this.props.auth &&
          this.props.auth.signup &&
          this.props.auth.signup(values));
      }
    });
  };

  componentWillUnmount() {
    const { alert } = this.props;
    alert && alert.reset && alert.reset();
  }

  render() {
    const { form, intl, alert } = this.props;
    const errors = alert && alert.errors;

    return (
      <Wrapper img={<Hello />} className="signup-wrapper" title="signup.title">
        {errors &&
          errors.map((error, i) => (
            <Alert
              key={`${i}`}
              alertItem={error}
              message={error.message && <FormattedMessage id={error.message} />}
              type="error"
            />
          ))}
        <Form className="form-signup" onSubmit={this.handleSubmit}>
          <Row gutter={28}>
            <Col className="gutter-box" span={12}>
              <Text
                validateTrigger="onSubmit"
                form={form}
                label={<FormattedMessage id="signup.form.firstname" />}
                id="firstname"
                rules={[
                  {
                    message: intl.formatMessage({
                      id: 'signup.form.firstname_error',
                    }),
                    required: true,
                  },
                ]}
              />
            </Col>
            <Col span={12}>
              <Text
                validateTrigger="onSubmit"
                form={form}
                label={<FormattedMessage id="signup.form.lastname" />}
                id="lastname"
                rules={[
                  {
                    message: intl.formatMessage({
                      id: 'signup.form.lastname_error',
                    }),
                    required: true,
                  },
                ]}
              />
            </Col>
          </Row>
          <Email
            validateTrigger="onSubmit"
            label={<FormattedMessage id="signup.form.email" />}
            id="email"
            rules={[
              {
                message: intl.formatMessage({
                  id: 'signup.form.email_error',
                }),
                required: true,
                type: 'email',
              },
            ]}
            form={form}
          />
          <Password form={form} />
          <ConfirmPassword form={form} />
          <Checkbox
            validateTrigger="onSubmit"
            id="cgu"
            label={
              <span>
                <FormattedMessage id="signup.form.legal" />{' '}
                <a target="_blank" href="/cgu.pdf">
                  <u className="main-color">
                    <FormattedMessage id="signup.form.legal_link" />
                  </u>
                </a>
              </span>
            }
            rules={[
              {
                message: intl.formatMessage({
                  id: 'signup.form.legal_error',
                }),
                required: true,
              },
            ]}
            form={form}
          />
          <Checkbox
            validateTrigger="onSubmit"
            id="offers"
            label={<FormattedMessage id="signup.form.partners" />}
            form={form}
          />
          <Submit label={{ id: 'signup.form.submit' }} />
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
