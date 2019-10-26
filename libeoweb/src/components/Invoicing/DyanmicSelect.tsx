import { Row } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import { Select, SelectOption } from 'components/Invoicing/Form';
import { Moment } from 'moment';
import * as React from 'react';
import { FormattedMessage } from 'react-intl';

interface IProps extends FormComponentProps {
  id: string;
  title: string | React.ReactNode;
  options?: any[];
  partnerIds?: any[];
  placeholder?: string;
  defaultValue?: any;
  displayKey: string;
  onChangeSelect?: (
    value: any,
    option: React.ReactElement<any> | Array<React.ReactElement<any>>,
  ) => void;
}

interface IState {}

class DynamicSelectBox extends React.PureComponent<IProps, IState> {
  render() {
    const {
      title,
      placeholder,
      defaultValue,
      displayKey,
      form,
      options,
      id,
      onChangeSelect,
      partnerIds = [],
    } = this.props;

    const choices = options || ['a', 'b', 'c', 'd', 'e'];
    return (
      <div className="invoicing-select">
        <div className="invoicing-element-title">{title}</div>
        <Select
          id={id}
          placeholder={placeholder}
          label={null}
          showSearch
          form={form}
          defaultValue={defaultValue}
          onChangeSelect={onChangeSelect}
          options={
            partnerIds.length === 0
              ? choices.map((option, index) => (
                  <SelectOption key={option.id}>
                    {option[displayKey]}
                  </SelectOption>
                ))
              : choices.map((option, index) => (
                  <SelectOption key={option.id} value={partnerIds[index]}>
                    {option[displayKey]}
                  </SelectOption>
                ))
          }
        />
      </div>
    );
  }
}

export default DynamicSelectBox;
