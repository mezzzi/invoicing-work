import Icon, { IconValue } from 'components/Assets/Icon';
import * as React from 'react';
import Dialog, { IDialogProps } from './Dialog';

const DialogOnboardingStart: React.FunctionComponent<IDialogProps> = ({
  className = 'alert',
  closable = true,
  description = 'dialog.onboarding_start.description',
  icon = IconValue.Alert,
  img = <Icon value={IconValue.OnboardingStart} />,
  link = '/kyc',
  linkTitle = 'dialog.onboarding_start.contact',
  title = 'dialog.onboarding_start.title',
  ...rest
}) => {
  return (
    <Dialog
      className={`onboarding-start-dialog ${className}`}
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

export default DialogOnboardingStart;
