import Form, { FormComponentProps } from 'antd/lib/form';
import { Text } from 'components/Form';
import * as React from 'react';
import { compose } from 'react-apollo';
import './TagManager.module.less';

interface IProps extends FormComponentProps {
  isNew?: boolean;
  defaultValue?: React.ReactNode;
  value?: React.ReactNode;
  placeholder?: string;
  maxLength?: number;
  editable?: boolean;
  onChange?: (value?: string) => void;
}
interface IState {
  defaultValue?: string;
  value?: string;
  edit: boolean;
}

class TagManagerEditableValue extends React.PureComponent<IProps, IState> {
  static getDerivedStateFromProps(props: IProps, state: IState) {
    if (
      typeof state.value === 'undefined' ||
      state.value === null ||
      props.value !== state.defaultValue
    ) {
      return {
        defaultValue: props.value,
        value: props.value,
      };
    }

    return null;
  }

  state = {
    edit: false,
    value: undefined,
  };

  handleInputRef: (node: React.ReactNode) => void;
  handleBlur: () => any;
  handleChange: (node: React.ChangeEvent<Element>) => any;
  handleFocus: () => any;
  handleOnClick: () => any;
  constructor(props: any) {
    super(props);

    this.handleBlur = this.blur.bind(this);
    this.handleFocus = this.focus.bind(this);
    this.handleOnClick = this.onClick.bind(this);
    this.handleChange = this.change.bind(this);
    this.handleInputRef = this.inputRef.bind(this);
  }

  inputRef(node: React.ReactNode) {
    if (!(node instanceof Element)) {
      return;
    }
  }

  blur() {
    this.setState({
      edit: false,
    });
    if (this.state.value !== this.props.value) {
      this.props.onChange && this.props.onChange(this.state.value);
    }
  }

  focus() {
    this.setState({
      edit: true,
    });
  }

  onClick() {
    this.setState({
      edit: true,
    });
  }

  change(node: React.ChangeEvent<Element>) {
    this.setState({
      value: (node.currentTarget as any).value,
    });
  }

  render() {
    const { placeholder, form, isNew, maxLength, editable } = this.props;
    const { value, edit } = this.state;

    return (
      <div
        className={`tag-manager-row-editable ${edit ? 'visible' : 'hidden'}`}
      >
        {editable && (
          <Text
            maxLength={maxLength}
            autoFocus={isNew}
            ref={this.handleInputRef}
            defaultValue={typeof value === 'string' ? value : ''}
            onBlur={this.handleBlur}
            onFocus={this.handleFocus}
            onChange={this.handleChange}
            small
            marge={false}
            form={form}
          />
        )}
        <span className="tag-manager-row-value">{value}</span>
      </div>
    );
  }
}

export default compose(Form.create({}))(TagManagerEditableValue);
