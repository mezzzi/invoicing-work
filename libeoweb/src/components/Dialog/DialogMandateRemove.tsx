import Icon, { IconValue } from 'components/Assets/Icon';
import { BtnType, Button } from 'components/Button';
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import Dialog, { IDialogProps } from './Dialog';

/**
 * @props
 */
interface IProps extends IDialogProps {
  onRemove: () => void;
}

const DialogMandateRemove: React.FunctionComponent<IProps> = ({
  className = 'alert',
  closable = true,
  description = 'dialog.mandate.description',
  footerIcon,
  footerTitle = 'dialog.mandate.link',
  icon = IconValue.Alert,
  title = 'dialog.mandate.title',
  onRemove,
  ...rest
}) => {
  return (
    <Dialog
      className={`mandate-remove-dialog ${className}`}
      closable
      description={description}
      footerIcon={footerIcon}
      footerTitle={footerTitle}
      icon={icon}
      img={<Icon value={IconValue.Question} />}
      title={title}
      {...rest}
    >
      <Button type={BtnType.Primary} onClick={onRemove}>
        <FormattedMessage id="dialog.mandate.btn_remove" />
      </Button>
    </Dialog>
  );
};

export default DialogMandateRemove;
