import Form, { FormComponentProps } from 'antd/lib/form';
import { Icon } from 'components/Assets';
import { IconValue } from 'components/Assets/Icon';
import { Code } from 'components/Form';
import * as React from 'react';
import { compose } from 'react-apollo';
import Dialog, { IDialogProps } from './Dialog';

/**
 * @props
 */
interface IProps extends IDialogProps, FormComponentProps {
  id?: string;
  onComplete?: (code?: string) => void;
  generateCode?: (id: string) => void;
}

const DialogCode: React.FunctionComponent<IProps> = ({
  className = 'alert',
  footerTitle = 'dialog.code.send',
  generateCode,
  form,
  description = 'dialog.code.description',
  footerIcon = IconValue.Clockwise,
  icon = IconValue.Wallet,
  id,
  img = <Icon value={IconValue.InsufficientMoney} />,
  onComplete,
  title = 'dialog.code.title',
  ...rest
}) => {
  const [loading, setLoading] = React.useState(false);

  const footerClick = async () => {
    setLoading(true);
    if (generateCode && id) {
      await generateCode(id);
    }
    setLoading(false);
  };

  const complete = async (value?: string) => {
    value && onComplete && onComplete(value);
  };

  React.useEffect(() => {
    if (generateCode && id) {
      generateCode(id);
    }
    return () => {};
  }, []);

  return (
    <Dialog
      closable={true}
      footerClick={footerClick}
      description={description}
      footerIcon={footerIcon}
      icon={icon}
      img={img}
      className={`code-dialog ${className} ${loading ? ' loading' : ''}`}
      {...rest}
      footerTitle={!loading ? footerTitle : `${footerTitle}_loading`}
    >
      <Code onComplete={complete} form={form} />
    </Dialog>
  );
};

export default compose(Form.create({}))(DialogCode);
