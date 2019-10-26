import { Icon } from 'components/Assets';
import { IconValue } from 'components/Assets/Icon';
import { Div } from 'components/Typo';
import * as React from 'react';
import { FormattedMessage, FormattedNumber } from 'react-intl';

interface IProps {
  amount: number;
  currency: string;
}

interface IState {}

class BalanceCard extends React.PureComponent<IProps, IState> {
  state = {};

  render() {
    const { amount, currency } = this.props;

    return (
      <div className="balance-card">
        <Div
          css={{
            bold: true,
            fontSize: '12px',
            lightColor: true,
          }}
        >
          <FormattedMessage id="balance.card.your_balance" />
        </Div>
        <Div
          css={{
            bold: true,
            fontSize: '35px',
          }}
        >
          <FormattedNumber
            style="currency"
            currency={currency}
            value={amount}
          />
        </Div>
        <Div
          className="footer"
          css={{
            bold: true,
            fontSize: '11px',
            primaryColor: true,
            uppercase: true,
          }}
        >
          <FormattedMessage id="balance.card.tansfert" />
          <div className="dot3-wrapper">
            <Icon value={IconValue.Dots3} />
          </div>
        </Div>
      </div>
    );
  }
}

export default BalanceCard;
