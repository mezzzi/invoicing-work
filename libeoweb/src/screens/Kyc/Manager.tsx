import { FormComponentProps } from 'antd/lib/form';
import { Content } from 'components/Layout';
import { Heading } from 'components/Typo';
import * as Company from 'context/Company';
import * as User from 'context/User';
import * as React from 'react';
import { InjectedIntlProps } from 'react-intl';
import { RouteComponentProps } from 'react-router';
import history from 'store/history';
import * as KycCtx from './context';

export interface IManagerProps
  extends RouteComponentProps,
    FormComponentProps,
    Company.InjectedProps,
    User.InjectedProps,
    InjectedIntlProps,
    KycCtx.InjectedProps {
  kycProps: {
    headingTitle?: string;
    headingDescription?: string;
    sidebar?: boolean;
    step?: string;
    nextStep?: string;
    bottomBar?: boolean;
    btn?: string;
    btnDisabled?: boolean;
    btnLink?: string;
    btnLater?: string;
    btnLaterLink?: string;
  };
}

export interface IManagerState {}

class Manager<
  P extends IManagerProps,
  S extends IManagerState & any
> extends React.PureComponent<P, S & any> {
  static defaultProps: Partial<IManagerProps> = {};

  state: Partial<IManagerState> = {};

  handleLater: () => Promise<boolean | undefined>;
  handleSave: () => Promise<boolean | undefined>;
  handleError: () => void;
  constructor(props: any) {
    super(props);

    this.handleLater = this.later.bind(this);
    this.handleSave = this.save.bind(this);
    this.handleError = this.onError.bind(this);
  }

  load() {
    this.props.kycSetState &&
      this.props.kycSetState({
        btnLoading: true,
      });
  }

  async later(): Promise<boolean | undefined> {
    const {
      kyc: { btnLaterLink },
    } = this.props;
    btnLaterLink && history.push(btnLaterLink as string);
    return true;
  }

  async onError() {
    this.props.kycSetState &&
      this.props.kycSetState({
        btnLaterLoading: false,
        btnLoading: false,
      });
  }

  async save(): Promise<boolean | undefined> {
    const {
      company,
      kycSetState,
      kyc: { nextStep, btnLink },
    } = this.props;
    kycSetState({ btnLoading: true });

    if (nextStep && company) {
      await company.step(nextStep);
    }
    kycSetState({ btnLoading: false });
    btnLink && history.push(btnLink);
    return true;
  }

  componentWillUnmount() {
    const { offValidateStep, offValidateLater } = this.props;
    offValidateStep && offValidateStep(this.handleSave);
    offValidateLater && offValidateLater(this.handleLater);
  }

  componentDidMount() {
    const { onValidateStep, onValidateLater } = this.props;
    onValidateStep && onValidateStep(this.handleSave);
    onValidateLater && onValidateLater(this.handleLater);

    this.props.kycSetState && this.props.kycSetState(this.props.kycProps);
  }

  _render(node: React.ReactNode) {
    const { kycProps, user } = this.props;
    const me = user && user.data && user.data.me;
    const company =
      me &&
      me.currentCompany &&
      (me.currentCompany.name || me.currentCompany.brandName);

    const headingTitle = kycProps && kycProps.headingTitle;
    const headingDescription = kycProps && kycProps.headingDescription;

    return (
      <Content>
        {headingTitle && (
          <div>
            <Heading
              titleVariables={{
                company,
              }}
              title={headingTitle}
              description={headingDescription}
            />
          </div>
        )}
        {node}
      </Content>
    );
  }
}

// export default compose(
//   KycCtx.hoc()
// )(Manager);
export default Manager;
