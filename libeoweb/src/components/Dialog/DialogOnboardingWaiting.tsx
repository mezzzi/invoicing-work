import Icon, { IconValue } from 'components/Assets/Icon';
import * as React from 'react';
import Dialog, { IDialogProps } from './Dialog';

const DialogOnboardingWaiting: React.FunctionComponent<IDialogProps> = ({
  className = 'alert',
  closable = true,
  description = 'dialog.onboarding_waiting.description',
  icon = IconValue.Alert,
  img = <Icon value={IconValue.OnboardingStart} />,
  link = '#',
  linkTitle = 'dialog.onboarding_waiting.contact',
  title = 'dialog.onboarding_waiting.title',
  ...rest
}) => {
  return (
    <Dialog
      className={`onboarding-waiting-dialog ${className}`}
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

export default DialogOnboardingWaiting;
