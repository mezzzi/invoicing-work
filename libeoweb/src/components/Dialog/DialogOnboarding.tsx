import Icon, { IconValue } from 'components/Assets/Icon';
import * as React from 'react';
import Dialog, { IDialogProps } from './Dialog';

const DialogOnboarding: React.FunctionComponent<IDialogProps> = ({
  className = 'alert',
  closable = true,
  description = 'dialog.onboarding.description',
  icon = IconValue.Alert,
  img = <Icon value={IconValue.CompleteOnboarding} />,
  link = '/kyc',
  linkTitle = 'dialog.onboarding.link',
  title = 'dialog.onboarding.title',
  ...rest
}) => {
  return (
    <Dialog
      className={`onboarding-dialog ${className}`}
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

export default DialogOnboarding;
