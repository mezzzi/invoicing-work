import { Col, Row } from 'antd';
import { Icon } from 'components/Assets';
import { IconValue } from 'components/Assets/Icon';
import * as AccountingCtx from 'context/Accounting';
import { IAccountingPreference } from 'context/Accounting/types';
import * as React from 'react';
import './TagManager.module.less';
import TagManagerEditableValue from './TagManagerEditableValue';

export interface ITagManagerRowProps
  extends IAccountingPreference,
    AccountingCtx.InjectedProps {
  isNew?: boolean;
  label?: React.ReactNode; // label replace key because react 'key' is a reserved word
  editDescription?: boolean;
  editLabel?: boolean;
  editValue?: boolean;
  className?: string;
  hasDescription?: boolean;
  reorder?: boolean;
  remove?: boolean;
  companyId?: string;
}

interface IProps extends ITagManagerRowProps {
  onUpdate?: (row: ITagManagerRowProps) => void;
}
interface IState {}

class TagManagerRow extends React.PureComponent<IProps, IState> {
  state = {};

  handleChange: (key: string, value?: string | boolean) => void;
  constructor(props: any) {
    super(props);

    this.handleChange = this.update.bind(this);
  }

  async update(key: string, value?: string | boolean) {
    const { isNew, label, accounting, ...props } = this.props;

    const preference: any = {
      ...{
        description: props.description || '',
        enabled: props.enabled,
        id: props.id,
        key: typeof label === 'string' ? label : '',
        order: props.order,
        type: props.type,
        value: typeof props.value === 'string' ? props.value : '',
      },
      [key]: value,
    };

    if (preference.enabled === false) {
      preference.order = -1;
    }

    if (
      accounting &&
      accounting.createOrUpdateAccountingPreferences &&
      props.type
    ) {
      await accounting.createOrUpdateAccountingPreferences(
        [preference],
        props.type,
      );
    }
  }

  render() {
    const {
      id,
      label,
      value,
      description,
      enabled,
      className,
      isNew,
      editDescription,
      editLabel,
      editValue,
      hasDescription,
      remove,
      reorder,
    } = this.props;

    return (
      <Row
        {...{ id }}
        className={`tag-manager-row ${className ? ` ${className}` : ''} ${
          !enabled ? ` hidden` : ''
        }`}
        type="flex"
      >
        <Col className={`${reorder ? 'drag draggable' : 'no-drag'}`}>
          {reorder && <Icon value={IconValue.Menu} />}
        </Col>
        <Col className="label">
          <TagManagerEditableValue
            editable={editLabel}
            maxLength={100}
            onChange={this.handleChange.bind(null, 'key')}
            isNew={isNew}
            value={label}
          />
        </Col>
        <Col className="value">
          <TagManagerEditableValue
            editable={editValue}
            maxLength={100}
            onChange={this.handleChange.bind(null, 'value')}
            value={value}
          />
        </Col>
        {hasDescription && (
          <Col className="description">
            <TagManagerEditableValue
              editable={editDescription}
              maxLength={150}
              onChange={this.handleChange.bind(null, 'description')}
              value={description}
            />
          </Col>
        )}
        <Col
          onClick={
            remove && id
              ? this.handleChange.bind(null, 'enabled', false)
              : undefined
          }
          className="remove"
        >
          {remove && id && <Icon value={IconValue.Trash} />}
        </Col>
      </Row>
    );
  }
}

export default AccountingCtx.hoc()(TagManagerRow);
