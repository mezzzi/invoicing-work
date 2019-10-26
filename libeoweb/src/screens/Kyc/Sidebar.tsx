import * as React from 'react';
import { compose } from 'react-apollo';
import * as KycCtx from './context';
import SidebarItem from './SidebarItem';

type stepType =
  | 'intro'
  | 'company'
  | 'beneficiary'
  | 'personal-information'
  | 'sign'
  | 'iban';

interface IStep {
  name: stepType;
  visible: boolean;
  title?: string;
  description?: string;
}

interface IProps extends KycCtx.InjectedProps {
  current: stepType;
}

interface IState {
  steps: IStep[];
}

class Sidebar extends React.PureComponent<IProps, IState> {
  static defaultProps = {
    current: 'intro',
  };

  state = {
    steps: [
      {
        description: undefined,
        name: 'intro',
        title: undefined,
        visible: false,
      },
      {
        description: 'kyc.sidebar.company_description',
        name: 'company',
        title: 'kyc.sidebar.company_title',
        visible: true,
      },
      {
        description: 'kyc.sidebar.personal_information_description',
        name: 'personal-information',
        title: 'kyc.sidebar.personal_information_title',
        visible: true,
      },
      {
        description: 'kyc.sidebar.beneficiary_description',
        name: 'beneficiary',
        title: 'kyc.sidebar.beneficiary_title',
        visible: true,
      },
      {
        description: 'kyc.sidebar.sign_description',
        name: 'sign',
        title: 'kyc.sidebar.sign_title',
        visible: true,
      },
      {
        description: undefined,
        name: 'iban',
        title: undefined,
        visible: false,
      },
    ] as IStep[],
  };

  render() {
    const { steps } = this.state;
    const { current } = this.props;
    let currentStep: IStep = steps[0];
    steps.map((step: IStep) => {
      if (step.name === current) {
        currentStep = step;
      }
    });
    let active: boolean = true;

    return (
      <div
        className={`kyc-sidebar-outer kyc-sidebar-outer-${
          currentStep.name && currentStep.visible ? 'visible' : 'hidden'
        }`}
      >
        <div
          className={`kyc-sidebar kyc-sidebar-${currentStep.name} kyc-sidebar-${
            currentStep.name && currentStep.visible ? 'visible' : 'hidden'
          }`}
        >
          {steps.map((step: IStep, i: number) => {
            const sidebarItem = step.visible && (
              <SidebarItem
                {...step}
                active={active}
                done={active && currentStep.name !== step.name}
                key={`${i}`}
                index={i}
              />
            );
            if (currentStep.name === step.name) {
              active = false;
            }
            return sidebarItem;
          })}
        </div>
      </div>
    );
  }
}

export default compose(KycCtx.hoc())(Sidebar);
