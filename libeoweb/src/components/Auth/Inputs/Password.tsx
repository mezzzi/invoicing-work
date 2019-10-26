import { FormComponentProps } from 'antd/lib/form';
import * as React from 'react';
import { FormattedMessage, InjectedIntlProps, injectIntl } from 'react-intl';
import { compose } from 'recompose';
import { AbstractPassword } from '../../Form';
import { PASSWORD_PATTERN } from '../rules';

type innerProps = FormComponentProps & InjectedIntlProps;
type outterProps = FormComponentProps;

const PasswordComponent: React.FunctionComponent<innerProps> = ({
  form,
  intl,
}) => {
  return (
    <AbstractPassword
      validateTrigger="onSubmit"
      label={<FormattedMessage id="signup.form.password" />}
      rules={[
        {
          message: `${intl.formatMessage({
            id: 'signup.form.password_error',
          })}\n`,
          required: true,
        },
        {
          message: intl.formatMessage({
            id: 'signup.form.password_strong_error',
          }),
          pattern: PASSWORD_PATTERN,
          required: true,
        },
      ]}
      form={form}
      hint={intl.formatMessage({
        id: 'signup.form.password_hint',
      })}
    />
  );
};

export const Password = compose<innerProps, outterProps>(injectIntl)(
  PasswordComponent,
);
