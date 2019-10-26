import { BtnType, Button } from 'components/Button';
import { FloatingActionFooter } from 'components/Layout';
import * as React from 'react';
import { compose } from 'react-apollo';
import { FormattedMessage } from 'react-intl';
import * as KycCtx from './context';

interface IProps extends KycCtx.InjectedProps {}
interface IState {}

class BottomBarFix extends React.PureComponent<IProps, IState> {
  state = {};

  constructor(props: any) {
    super(props);
  }

  render() {
    const {
      kyc: {
        bottomBar,
        btnLoading,
        btnLaterLoading,
        btnLater,
        btnDisabled,
        btn,
      },
      validateStep,
      validateLater,
    } = this.props;

    return bottomBar ? (
      <FloatingActionFooter visible={true}>
        <div
          style={{
            display: 'flex',
            flex: 1,
            justifyContent: 'flex-end',
          }}
        >
          {btnLater && (
            <Button
              loading={btnLaterLoading}
              onClick={validateLater}
              style={{ marginRight: 50 }}
              type={BtnType.Default}
            >
              <FormattedMessage id={btnLater} />
            </Button>
          )}
          {btn && (
            <Button
              disabled={btnDisabled || false}
              loading={btnLoading}
              onClick={validateStep}
              style={{ marginRight: 50 }}
              type={BtnType.Primary}
            >
              <FormattedMessage id={btn} />
            </Button>
          )}
        </div>
      </FloatingActionFooter>
    ) : null;
  }
}

export default compose(KycCtx.hoc())(BottomBarFix);
