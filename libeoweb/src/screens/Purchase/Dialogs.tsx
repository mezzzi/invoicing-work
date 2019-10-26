import {
  DialogCode,
  DialogOnboarding,
  DialogOnboardingFund,
  DialogOnboardingRefused,
  DialogOnboardingStart,
  DialogOnboardingWaiting,
  DialogTransfert,
} from 'components/Dialog';
import * as Alert from 'context/Alert';
import { IAlertContextInterface, IAlertInterface } from 'context/Alert/context';
import { IInvoice } from 'context/Invoice/types';
import { get as getCookie, set as setCookie } from 'es-cookie';
import * as React from 'react';
import { compose } from 'react-apollo';

export type dialogsType =
  | 'start'
  | 'onboarding'
  | 'fund'
  | 'waiting'
  | 'transfert'
  | 'code'
  | 'refused';

interface IProps extends Alert.InjectedProps {
  onClose?: (code?: string) => void;
  invoiceId?: string;
  generateCode?: (id: string) => void;
  modalVisible?: dialogsType;
}
interface IState {
  close: () => void;
  modalVisible?: dialogsType;
  visible: boolean;
}

class Dialogs extends React.PureComponent<IProps, IState> {
  static shouldDisplayWaiting(
    modalVisible?: dialogsType,
    alert?: IAlertInterface,
  ): boolean {
    const duration = new Date();
    duration.setHours(duration.getHours() + 1);

    if (modalVisible === 'waiting') {
      const isPending = getCookie('popin-onboardin-waiting');
      if (isPending) {
        return false;
      } else {
        setCookie('popin-onboardin-waiting', 'true', { expires: duration });
      }
    } else if (modalVisible === 'transfert') {
      const isWaitingFund = getCookie('popin-onboardin-fund');
      if (isWaitingFund) {
        alert && alert.warning('dialog.transfert.alert', true);
        return false;
      } else {
        setCookie('popin-onboardin-fund', 'true', { expires: duration });
      }
    }

    return true;
  }

  static getDerivedStateFromProps(props: IProps, state: IState) {
    if (props.modalVisible !== state.modalVisible) {
      const isVisible: boolean = Dialogs.shouldDisplayWaiting(
        props.modalVisible,
        props.alert,
      );
      if (!isVisible) {
        setTimeout(() => {
          state.close();
        }, 100);
      }
      return {
        modalVisible: props.modalVisible,
        visible: isVisible,
      };
    }
    return null;
  }
  state = {
    close: (code?: string) => {
      const { onClose, modalVisible } = this.props;
      this.setState({
        visible: false,
      });
      onClose && onClose(code);
    },
    modalVisible: undefined,
    visible: false,
  };

  render() {
    const { visible, modalVisible } = this.state;
    const { invoiceId, generateCode } = this.props;

    return (
      <>
        {modalVisible === 'code' && (
          <DialogCode
            onComplete={this.state.close}
            id={invoiceId}
            generateCode={generateCode}
            onCancel={this.state.close.bind(null, undefined)}
            visible={visible}
          />
        )}
        {modalVisible === 'start' && (
          <DialogOnboardingStart
            onCancel={this.state.close.bind(null, undefined)}
            visible={visible}
          />
        )}
        {modalVisible === 'fund' && (
          <DialogOnboardingFund
            onCancel={this.state.close.bind(null, undefined)}
            visible={visible}
          />
        )}
        {modalVisible === 'waiting' && (
          <DialogOnboardingWaiting
            onCancel={this.state.close.bind(null, undefined)}
            visible={visible}
          />
        )}
        {modalVisible === 'refused' && (
          <DialogOnboardingRefused
            onCancel={this.state.close.bind(null, undefined)}
            visible={visible}
          />
        )}
        {modalVisible === 'onboarding' && (
          <DialogOnboarding
            onCancel={this.state.close.bind(null, undefined)}
            visible={visible}
          />
        )}
        {modalVisible === 'transfert' && (
          <DialogTransfert
            onCancel={this.state.close.bind(null, undefined)}
            visible={visible}
          />
        )}
      </>
    );
  }
}

export default compose(Alert.hoc())(Dialogs);
