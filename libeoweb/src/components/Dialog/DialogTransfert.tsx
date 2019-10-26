import { Row } from 'antd';
import { Icon } from 'components/Assets';
import { IconValue } from 'components/Assets/Icon';
import { BtnType, Button } from 'components/Button';
import Iban from 'components/Form/Iban';
import { A } from 'components/Typo';
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import history from 'store/history';
import Dialog, { IDialogProps } from './Dialog';

/**
 * @props
 */
interface IProps extends IDialogProps {
  iban?: string;
}

const DialogTransfert: React.FunctionComponent<IProps> = ({
  className = 'alert',
  closable = true,
  description = 'dialog.transfert.description',
  icon = IconValue.Wallet,
  title = 'dialog.transfert.title',
  ...rest
}) => {
  const [refused, setRefused] = React.useState(false);

  const goToBank = () => {
    history.push('/company/bank', { action: 'autoload' });
  };

  const refuse = () => {
    setRefused(true);
  };

  return (
    <Dialog
      className={`transfert-dialog ${className}`}
      closable={closable}
      description={description}
      icon={icon}
      img={<Icon value={IconValue.InsufficientMoney} />}
      title={title}
      {...rest}
    >
      <Row
        style={{
          marginBottom: 15,
        }}
        type="flex"
      >
        <Iban />
      </Row>
      {/* TODO: FEATURE-AUTOLOAD
      {refused && (
        <Row
          style={{
            marginBottom: 15,
          }}
          type="flex"
        >
          <Iban />
        </Row>
      )}
      <Row type="flex">
        !refused && (
          <A
            onClick={refuse}
            tag="div"
            style={{
              color: 'black',
              cursor: 'pointer',
            }}
          >
            <FormattedMessage id="dialog.transfert.refused_autoload" />
          </A>
        )}
        <Button
          style={{
            marginLeft: 20,
          }}
          type={BtnType.Primary}
          onClick={goToBank}
        >
          <FormattedMessage id="dialog.transfert.go_to_autoload" />
        </Button>
      </Row> */}
    </Dialog>
  );
};

export default DialogTransfert;
