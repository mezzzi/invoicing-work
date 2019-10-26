import * as React from 'react';

import AngleDownThin from 'components/Invoicing/Assets/icons/angel-down-thin.svg';
import AngleUpThin from 'components/Invoicing/Assets/icons/angel-up-thin.svg';
import Attach from 'components/Invoicing/Assets/icons/attach.svg';
import More from 'components/Invoicing/Assets/icons/more.svg';

const Svgs: any = {
  AngleDownThin,
  AngleUpThin,
  Attach,
  More,
};

export enum InvoicingIconValue {
  AngleUpThin = 'AngleUpThin',
  AngleDownThin = 'AngleDownThin',
  Attach = 'Attach',
  More = 'More',
}
import 'components/Invoicing/Assets/Icon.module.less';

export interface IDefaultProps extends React.HTMLProps<HTMLElement> {
  value?: InvoicingIconValue;
  color?: string;
  style?: React.CSSProperties;
}

class IDefault extends React.PureComponent<IDefaultProps> {
  static defaultProps = {
    color: '#0053FA',
    style: undefined,
    value: InvoicingIconValue,
  };

  render() {
    const { value, ...props } = this.props;
    const Svg: any = value && Svgs[value];

    return <Svg {...props} />;
  }
}

export default IDefault;
