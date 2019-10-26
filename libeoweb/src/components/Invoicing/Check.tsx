import { Row } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import { Moment } from 'moment';
import * as React from 'react';
import { FormattedMessage } from 'react-intl';

import { CheckboxChangeEvent } from 'antd/lib/checkbox';
import { Checkbox } from 'components/Invoicing/Form';

interface IProps extends FormComponentProps {
  id: string;
  label: React.ReactNode;
  onChangeCheck?: (event: CheckboxChangeEvent, value: boolean) => void;
  defaultChecked?: boolean;
}

interface IState {}

class CheckBox extends React.PureComponent<IProps, IState> {
  render() {
    const { label, form, id, onChangeCheck, defaultChecked } = this.props;

    return (
      <Checkbox
        id={id}
        label={label}
        form={form}
        defaultChecked={defaultChecked}
        onChangeCheck={onChangeCheck}
      />
    );
  }
}

export default CheckBox;
