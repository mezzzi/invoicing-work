import { Heading } from 'components/Typo';
import { OnboardingStep } from 'context/Common/types';
import * as React from 'react';
import BottomBar from './BottomBar';
import Transition from './Transition';

export interface IManagerProps {
  children?: React.ReactNode;
  titleTransition?: string;
  title?: string;
  description?: string;
  img?: any;
  cta?: string;
  step?: OnboardingStep;
  nextStep?: OnboardingStep;
  onNext?: (step?: OnboardingStep) => void;
  transition?: boolean;
}
export interface IManagerState {
  done: boolean;
  loading: boolean;
  bottomVisible?: boolean;
  bottomCta?: string;
  bottomLaterCta?: string;
}

class Manager<
  P extends IManagerProps,
  S extends IManagerState & any
> extends React.PureComponent<P, S & any> {
  static defaultProps = {
    step: OnboardingStep.Welcome,
    title: '',
    transition: true,
  };

  state = {
    bottomCta: undefined,
    bottomLaterCta: undefined,
    bottomVisible: false,
    done: false,
    loading: false,
  };

  public handleNext: () => void;
  public handleDone: (later?: boolean) => void;
  constructor(props: any) {
    super(props);

    this.handleNext = this.next.bind(this);
    this.handleDone = this.done.bind(this);
  }

  next() {
    this.props.nextStep &&
      this.props.onNext &&
      this.props.onNext(this.props.nextStep);
  }

  done(later?: boolean) {
    this.setState({ done: true });
    if (!this.props.transition) {
      this.next();
    }
  }

  toggleCta(visible: boolean) {
    this.setState({
      bottomVisible: visible,
    });
  }

  _render(node: React.ReactNode) {
    const {
      step,
      title,
      description,
      titleTransition,
      cta,
      img,
      transition,
    } = this.props;
    const { done, bottomVisible, loading } = this.state;
    const bottomCta: any = this.state.bottomCta;
    const bottomLaterCta: any = this.state.bottomLaterCta;

    return (
      <>
        {(title || description) && (
          <div>
            <Heading title={title} description={description} />
          </div>
        )}
        {done && transition ? (
          <Transition
            onClickNext={this.handleNext}
            step={step}
            title={titleTransition}
            cta={cta}
            img={img}
          />
        ) : (
          <>
            {node}
            {bottomVisible && (
              <BottomBar
                loading={loading}
                btnTitle={bottomCta}
                btnLaterTitle={bottomLaterCta}
                visible={true}
                step={this.props.nextStep}
                onSave={this.handleDone.bind(null, false)}
                onLater={this.handleDone.bind(null, true)}
              />
            )}
          </>
        )}
      </>
    );
  }
}

export default Manager;
