import { Form } from 'antd';
import { Email, Submit } from 'components/Form';

import { FormComponentProps } from 'antd/lib/form';
import Icon, { IconValue } from 'components/Assets/Icon';
import * as Auth from 'context/Auth';
import * as React from 'react';
import { compose } from 'react-apollo';
import history from 'store/history';
import { Wrapper } from '..';
import { extractEmailFromURL } from '../utils/urlParametersExtractor';

interface IProps extends FormComponentProps, Auth.InjectedProps {}

const ResetPasswordRequestForm: React.FunctionComponent<IProps> = ({
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
        const resetPasswordStatus = await auth.resetPasswordRequest(
          values.email,
        );
        if (resetPasswordStatus) {
          history.push('reset-password-email-sent');
        }
      }
    });
  };
  const defaultEmail = extractEmailFromURL();
  return (
    <Wrapper
      img={<Icon value={IconValue.Hello} />}
      title="reset_password_request.title"
    >
      <Form onSubmit={onSubmit}>
        <Email
          form={form}
          id="email"
          defaultValue={defaultEmail}
          validateTrigger="onSubmit"
        />
        <Submit label={{ id: 'reset_password_request.submit' }} />
      </Form>
    </Wrapper>
  );
};

export default compose(
  Form.create(),
  Auth.hoc(),
)(ResetPasswordRequestForm);
