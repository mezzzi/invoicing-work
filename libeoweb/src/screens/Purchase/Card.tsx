import sell from '-!svg-react-loader!assets/icons/sell.svg';
const Sell: any = sell;
import buy from '-!svg-react-loader!assets/icons/buy.svg';
const Buy: any = buy;
import { Row } from 'antd';
import * as React from 'react';
import { FormattedMessage, InjectedIntlProps, injectIntl } from 'react-intl';
import './Card.module.less';

interface IProps extends InjectedIntlProps {
  title?: string;
  titleVariables?: any;
}
interface IState {}

class Card extends React.PureComponent<IProps, IState> {
  state = {};

  constructor(props: any) {
    super(props);
  }

  render() {
    const { title, titleVariables, children } = this.props;

    return (
      <div className="sidebar-card">
        <Row>
          {title && <FormattedMessage id={title} values={titleVariables} />}
        </Row>
        {children}
      </div>
    );
  }
}

export default injectIntl(Card);
