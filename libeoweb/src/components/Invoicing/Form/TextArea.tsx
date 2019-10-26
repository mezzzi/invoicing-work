import IDefault, {
  IDefaultProps,
  IDefaultState,
  IType,
} from 'components/Invoicing/Form/Default';
import * as React from 'react';

/**
 * @class TextInput
 *
 * Herit from IDefault class, state and props
 *
 * Customized by default props
 * No default validation rules
 */
class TextArea extends React.PureComponent<IDefaultProps, IDefaultState> {
  static defaultProps = {
    id: 'textarea',
    label: 'textarea',
    rules: [],
    type: IType.TextArea,
  };

  render() {
    return <IDefault {...this.props} />;
  }
}

export default TextArea;
