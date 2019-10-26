import { Row } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import { Moment } from 'moment';
import * as React from 'react';
import { FormattedMessage } from 'react-intl';

import { Date } from 'components/Invoicing/Form';

interface IProps extends FormComponentProps {
  id: string;
  title: string | React.ReactNode;
  defaultValue?: Moment;
  onChangeDate?: (date: Moment, dateString: string) => void;
}

interface IState {}

class DateBox extends React.PureComponent<IProps, IState> {
  render() {
    const { title, defaultValue, form, id, onChangeDate } = this.props;

    return (
      <div className="invoicing-input">
        <div className="invoicing-element-title">{title}</div>
        <Date
          id={id}
          defaultValue={defaultValue}
          label={null}
          form={form}
          onChangeDate={onChangeDate}
        />
      </div>
    );
  }
}

export default DateBox;
