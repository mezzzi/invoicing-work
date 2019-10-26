import IDefault, {
  IDefaultProps,
  IDefaultState,
  IType,
} from 'components/Invoicing/Form/Default';
import * as React from 'react';

/**
 * @class Checkbox
 *
 * Herit from IDefault class, state and props
 *
 * Customized by default props (usually required or not, default not)
 * Can be overrided by parent set props
 */
class Checkbox extends React.PureComponent<IDefaultProps, IDefaultState> {
  static defaultProps = {
    id: 'checkbox',
    label: 'text',
    rules: [],
    type: IType.Checkbox,
  };

  render() {
    return <IDefault {...this.props} />;
  }
}

export default Checkbox;
