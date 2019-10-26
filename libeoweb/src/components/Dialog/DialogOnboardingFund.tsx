import Icon, { IconValue } from 'components/Assets/Icon';
import Iban from 'components/Form/Iban';
import * as React from 'react';
import Dialog, { IDialogProps } from './Dialog';

/**
 * @props
 */
interface IProps extends IDialogProps {
  iban?: string;
}

const DialogOnboardingFund: React.FunctionComponent<IProps> = ({
  className = 'alert',
  closable = true,
  description = 'dialog.fund.description',
  iban,
  icon = IconValue.Alert,
  img = <Icon value={IconValue.InsufficientMoney} />,
  title = 'dialog.fund.title',
  ...rest
}) => {
  return (
    <Dialog
      className={`onboarding-fund-dialog ${className}`}
      closable={closable}
      description={description}
      icon={icon}
      img={img}
      title={title}
      {...rest}
    >
      <Iban />
    </Dialog>
  );
};

export default DialogOnboardingFund;
