import { Avatar, Card, Collapse } from 'antd';
import { CardProps } from 'antd/lib/card';
import { CollapsePanelProps } from 'antd/lib/collapse';
import { InvoicingIcon } from 'components/Invoicing/Assets';
import { InvoicingIconValue } from 'components/Invoicing/Assets/Icon';
import * as React from 'react';
const Panel = Collapse.Panel;

/**
 * @props
 */
interface IProps extends CardProps {
  children: React.ReactNode;
  shadow?: boolean;
  title?: React.ReactNode;
  titleAlign?: 'left' | 'right';
  collapsable?: boolean;
  extra?: React.ReactNode;
}

/**
 * @state
 *
 * error
 */
interface IState {
  open: boolean;
}

/**
 * @class Submit
 *
 */
class Default extends React.PureComponent<IProps, IState> {
  state = {
    open: true,
  };

  handleToggle = () => {
    this.setState(({ open }) => ({
      open: !open,
    }));
  };

  render() {
    const { open } = this.state;
    const { title, children, shadow, collapsable, className } = this.props;

    const panel = (
      <Panel
        showArrow={false}
        header={
          <div className="disp-jsb">
            {title}
            <InvoicingIcon
              className="panel-arrow"
              value={
                open
                  ? InvoicingIconValue.AngleUpThin
                  : InvoicingIconValue.AngleDownThin
              }
            />
          </div>
        }
        key="1"
        disabled={collapsable ? !collapsable : false}
      >
        {children}
      </Panel>
    );

    return (
      <Collapse
        onChange={this.handleToggle}
        defaultActiveKey={['1']}
        className={`collapse-card ${shadow ? 'shadow' : ''} ${className}`}
      >
        {panel}
      </Collapse>
    );
  }
}

export default Default;
