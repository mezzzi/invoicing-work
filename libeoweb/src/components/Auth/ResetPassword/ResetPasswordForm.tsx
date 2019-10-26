import { Form } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import Icon, { IconValue } from 'components/Assets/Icon';
import { Submit } from 'components/Form';
import * as Auth from 'context/Auth';
import * as React from 'react';
import { compose } from 'recompose';
import history from 'store/history';
import { Wrapper } from '..';
import { ConfirmPassword } from '../Inputs/ConfirmPassword';
import { Password } from '../Inputs/Password';

interface IProps extends FormComponentProps, Auth.InjectedProps {
  hash: string;
}

const ResetPasswordForm: React.FunctionComponent<IProps> = ({
  hash,
  form,
  auth,
}) => {
  const onSubmit = async (e: React.FormEvent) => {
    if (!auth) {
      throw new Error('Auth context not set');
    }
    e.preventDefault();
    form.validateFields(async (err, values) => {
      if (!err) {
        const resetPasswordStatus = await auth.resetPassword(
          values.password,
          values['confirm-password'],
          hash,
        );
        if (resetPasswordStatus) {
          history.push('/login');
        }
      }
    });
  };

  return (
    <Wrapper
      img={<Icon value={IconValue.Hello} />}
      title="reset_password_request.title"
    >
      <Form onSubmit={onSubmit}>
        <Password form={form} />
        <ConfirmPassword form={form} />
        <Submit label={{ id: 'reset_password_request.submit' }} />
      </Form>
    </Wrapper>
  );
};

export default compose<IProps, { hash: string }>(
  Form.create(),
  Auth.hoc(),
)(ResetPasswordForm);
