import { Col, Row } from 'antd';
import { Icon } from 'components/Assets';
import { IconValue } from 'components/Assets/Icon';
import * as React from 'react';
import { FormattedMessage } from 'react-intl';

interface IProps {
  active?: boolean;
  className?: string;
  description?: string;
  done?: boolean;
  index: number;
  title: string;
}
interface IState {}

class SidebarItem extends React.PureComponent<IProps, IState> {
  static defaultProps = {
    description: '',
    title: '',
  };

  state = {};

  render() {
    return (
      <Row
        className={`kyc-sidebar-item${
          this.props.className ? ` ${this.props.className}` : ''
        }${this.props.done ? ' done' : ''}${
          this.props.active ? ' active' : ' disabled'
        }`}
      >
        <Col className="kyc-sidebar-item-index">{`${this.props.index}`}</Col>
        <Col
          style={{
            flex: 1,
          }}
        >
          <div className="kyc-sidebar-item-title">
            <FormattedMessage id={this.props.title} />
            {!this.props.done && !this.props.active && (
              <Icon value={IconValue.Lock} color="white" />
            )}
            {this.props.done && '✅'}
          </div>
          <div className="kyc-sidebar-item-description">
            {this.props.description && (
              <FormattedMessage id={this.props.description} />
            )}
          </div>
        </Col>
      </Row>
    );
  }
}

export default SidebarItem;
