import { FormComponentProps } from 'antd/lib/form';
import * as React from 'react';
import { FormattedMessage, InjectedIntlProps, injectIntl } from 'react-intl';
import { compose } from 'recompose';
import { AbstractPassword } from '../../Form';

type innerProps = FormComponentProps & InjectedIntlProps;
type outterProps = FormComponentProps;

const ConfirmPasswordComponent: React.FunctionComponent<innerProps> = ({
  form,
  intl,
}) => {
  return (
    <AbstractPassword
      validateTrigger="onSubmit"
      label={<FormattedMessage id="signup.form.comfirm_password" />}
      form={form}
      id="confirm-password"
      rules={[
        {
          message: `${intl.formatMessage({
            id: 'signup.form.comfirm_password_error',
          })}\n`,
          required: true,
          validator: (rule, value, callback, source) => {
            if (source.password !== value) {
              return callback(false);
            }
            callback();
          },
        },
      ]}
    />
  );
};

export const ConfirmPassword = compose<innerProps, outterProps>(injectIntl)(
  ConfirmPasswordComponent,
);
