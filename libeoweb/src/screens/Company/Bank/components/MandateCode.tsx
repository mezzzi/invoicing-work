import { DialogCode } from 'components/Dialog';
import { IMandate } from 'context/Bank/types';
import * as User from 'context/User';
import * as React from 'react';
import { compose } from 'react-apollo';
import history from 'store/history';

interface IProps {
  onFinish?: () => void;
  generateCode?: (mandateId: string) => Promise<boolean | null>;
  sign?: (mandateId: string, code: string) => Promise<IMandate | null>;
  refetch?: () => Promise<any>;
  id: string;
  bankId?: string;
  visible?: boolean;
}

const MandateCode: React.FunctionComponent<IProps> = ({
  onFinish = () => {},
  generateCode = () => {},
  sign = () => {},
  refetch = () => {},
  id,
  bankId,
}) => {
  const [modalVisible, setModalVisible] = React.useState(true);

  const onClose = async (code: string) => {
    setModalVisible(false);
    if (code && id && sign) {
      const result = await sign(id, code);
      if (refetch) {
        await refetch();
      }
      if (result) {
        history.push(`/company/bank/mandate/view/${bankId}`);
      }
    }
    onFinish && onFinish();
  };

  const onCancel = async () => {
    setModalVisible(false);
    if (refetch) {
      await refetch();
    }
    onFinish && onFinish();
  };

  return (
    <DialogCode
      title="dialog.code.mandate_title"
      description="dialog.code.mandate_description"
      onComplete={onClose}
      id={id}
      generateCode={generateCode}
      onCancel={onCancel}
      visible={modalVisible}
    />
  );
};

export default compose(User.hoc())(MandateCode);
