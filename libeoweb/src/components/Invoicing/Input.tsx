import { FormComponentProps } from 'antd/lib/form';
import { Text } from 'components/Invoicing/Form';
import * as React from 'react';

interface IProps extends FormComponentProps {
  id?: string;
  title?: string | React.ReactNode;
  placeholder?: string;
  defaultValue?: string;
  onChange?: (node: React.ChangeEvent, value: string) => void;
  suffix?: string | React.ReactNode;
  quantity?: boolean;
  price?: boolean;
  vatRate?: boolean;
  name?: boolean;
  description?: boolean;
  disabled?: boolean;
  onBlur?: (...args: any[]) => any;
}

interface IState {}

class TextBox extends React.PureComponent<IProps, IState> {
  render() {
    const {
      name,
      description,
      onBlur,
      defaultValue,
      title,
      placeholder,
      form,
      onChange,
      id,
      suffix,
      quantity,
      price,
      vatRate,
      disabled,
    } = this.props;

    return (
      <div className="invoicing-input">
        {title && <div className="invoicing-element-title">{title}</div>}
        <Text
          id={id}
          placeholder={placeholder}
          defaultValue={defaultValue}
          label={null}
          showSearch
          form={form}
          onChange={onChange}
          suffix={suffix}
          quantity={quantity}
          price={price}
          vatRate={vatRate}
          disabled={disabled}
          onBlur={onBlur}
          name={name}
          description={description}
        />
      </div>
    );
  }
}

export default TextBox;
