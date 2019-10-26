import Icon, { IconValue } from 'components/Assets/Icon';
import * as React from 'react';
import Dialog, { IDialogProps } from './Dialog';

const DialogOnboardingRefused: React.FunctionComponent<IDialogProps> = ({
  className = 'alert',
  closable = true,
  description = 'dialog.onboarding_refused.description',
  icon = IconValue.Alert,
  img = <Icon value={IconValue.OnboardingRefused} />,
  link = '#',
  linkTitle = 'dialog.onboarding_refused.contact',
  title = 'dialog.onboarding_refused.title',
  ...rest
}) => {
  return (
    <Dialog
      className={`onboarding-refused-dialog ${className}`}
      closable={closable}
      description={description}
      icon={icon}
      img={img}
      link={link}
      linkTitle={linkTitle}
      title={title}
      {...rest}
    />
  );
};

export default DialogOnboardingRefused;
