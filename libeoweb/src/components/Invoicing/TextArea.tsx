import { Row } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import { TextArea } from 'components/Invoicing/Form';
import * as React from 'react';
import { FormattedMessage } from 'react-intl';

interface IProps extends FormComponentProps {
  id: string;
  title: string | React.ReactNode;
  placeholder?: string;
  defaultValue?: string;
  onChange?: (node: React.ChangeEvent, value: string) => void;
}

interface IState {}

class TextAreaBox extends React.PureComponent<IProps, IState> {
  render() {
    const { defaultValue, title, placeholder, form, onChange, id } = this.props;

    return (
      <div className="invoicing-input">
        <div className="invoicing-element-title txt-area">{title}</div>
        <TextArea
          id={id}
          defaultValue={defaultValue}
          label={null}
          placeholder={placeholder}
          form={form}
          onChangeTextArea={onChange}
        />
      </div>
    );
  }
}

export default TextAreaBox;
