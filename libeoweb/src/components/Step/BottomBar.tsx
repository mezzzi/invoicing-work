import { BtnType, Button } from 'components/Button';
import { FloatingActionFooter } from 'components/Layout';
import { OnboardingStep } from 'context/Common/types';
import * as React from 'react';
import { FormattedMessage } from 'react-intl';

interface IProps {
  btnLaterTitle?: string;
  btnTitle: string;
  loading?: boolean;
  onLater?: (step: OnboardingStep) => void;
  onSave?: (step: OnboardingStep) => void;
  step?: OnboardingStep;
  visible: boolean;
}
interface IState {}

class BottomBar extends React.PureComponent<IProps, IState> {
  render() {
    const { loading, visible } = this.props;

    return (
      <FloatingActionFooter visible={visible}>
        <div
          style={{
            display: 'flex',
            flex: 1,
            justifyContent: 'flex-end',
          }}
        >
          {this.props.btnLaterTitle && (
            <Button
              onClick={
                this.props.step &&
                this.props.onLater &&
                this.props.onLater.bind(null, this.props.step)
              }
              style={{ marginRight: 50 }}
              type={BtnType.Primary}
            >
              <FormattedMessage id={this.props.btnLaterTitle} />
            </Button>
          )}
          {this.props.btnTitle && (
            <Button
              loading={loading}
              onClick={
                this.props.step &&
                this.props.onSave &&
                this.props.onSave.bind(null, this.props.step)
              }
              style={{ marginRight: 50 }}
              type={BtnType.Default}
            >
              <FormattedMessage id={this.props.btnTitle} />
            </Button>
          )}
        </div>
      </FloatingActionFooter>
    );
  }
}

export default BottomBar;
