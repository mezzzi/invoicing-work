import events, { EventEmitter } from 'events';
import * as React from 'react';

interface IKycParams {
  bottomBar?: boolean;
  sidebar?: boolean;
  step?: string;
  nextStep?: string;
  bottombar?: boolean;
  btn?: string;
  btnDisabled?: boolean;
  btnLink?: string;
  btnLater?: string;
  btnLaterLink?: string;
  btnLoading?: boolean;
  btnLaterLoading?: boolean;
}

export interface IKycContext {
  kyc: IKycParams;
  kycSetState: (params: IKycParams) => void;
  validateStep: () => void;
  onValidateStep: (event: () => void) => void;
  offValidateStep: (event: () => void) => void;
  validateLater: () => void;
  onValidateLater: (event: () => void) => void;
  offValidateLater: (event: () => void) => void;
}

const Context = React.createContext<IKycContext>({
  kyc: {
    bottomBar: undefined,
    btn: undefined,
    btnLater: undefined,
    btnLaterLink: undefined,
    btnLaterLoading: undefined,
    btnLink: undefined,
    btnLoading: undefined,
    nextStep: undefined,
    sidebar: undefined,
    step: undefined,
  },
  kycSetState: () => {},
  offValidateLater: () => {},
  offValidateStep: () => {},
  onValidateLater: () => {},
  onValidateStep: () => {},
  validateLater: () => {},
  validateStep: () => {},
});

const Consumer = Context.Consumer;

interface IProps {}

interface IState extends IKycContext {}

class Provider extends React.PureComponent<IProps, IState> {
  state = {
    kyc: {
      bottomBar: undefined,
      btn: undefined,
      btnLater: undefined,
      btnLaterLoading: undefined,
      btnLink: undefined,
      btnLinkLater: undefined,
      btnLoading: undefined,
      nextStep: undefined,
      sidebar: undefined,
      step: undefined,
    },
    kycSetState: (params: IKycParams) => {
      this.setState({
        ...this.state,
        kyc: {
          ...this.state.kyc,
          ...params,
        },
      });
    },
    offValidateLater: (event: () => void) => {
      this.onValidateLater &&
        this.onValidateLater.removeListener &&
        this.onValidateLater.removeListener('onValidateLater', event);
    },
    offValidateStep: (event: () => void) => {
      this.onValidateStep &&
        this.onValidateStep.removeListener &&
        this.onValidateStep.removeListener('onValidateStep', event);
    },
    onValidateLater: (event: () => void) => {
      this.onValidateLater &&
        this.onValidateLater.addListener &&
        this.onValidateLater.addListener('onValidateLater', event);
    },
    onValidateStep: (event: () => void) => {
      this.onValidateStep &&
        this.onValidateStep.addListener &&
        this.onValidateStep.addListener('onValidateStep', event);
    },
    validateLater: () => {
      this.onValidateLater && this.onValidateLater.emit('onValidateLater');
    },
    validateStep: () => {
      this.onValidateStep && this.onValidateStep.emit('onValidateStep');
    },
  };

  onValidateStep?: EventEmitter;
  onValidateLater?: EventEmitter;
  constructor(props: any) {
    super(props);
    this.onValidateStep = new events.EventEmitter();
    this.onValidateLater = new events.EventEmitter();
  }

  render() {
    return (
      <Context.Provider value={this.state}>
        {this.props.children}
      </Context.Provider>
    );
  }
}

const composedProvider = Provider;

export { composedProvider as Provider, Consumer };
