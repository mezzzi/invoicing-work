import {
  Checkbox,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Radio,
  Select,
  Slider,
  Tooltip,
} from 'antd';
import { CheckboxChangeEvent } from 'antd/lib/checkbox';
import { FormComponentProps } from 'antd/lib/form';
import { RadioChangeEvent } from 'antd/lib/radio';
import { Icon } from 'components/Assets';
import { IconValue } from 'components/Assets/Icon';
import { Moment } from 'moment';
import * as React from 'react';

const Search = Input.Search;

const TextArea = Input.TextArea;

const FormItem = Form.Item;

/**
 * type for antd `getFieldDecorator` validation rules
 * @see https://ant.design/components/form/
 *
 * @param message: string;
 * @param pattern?: RegExp;
 * @param required: boolean;
 */
export interface InputRules {
  message: string;
  pattern?: RegExp;
  required: boolean;
}

/**
 * Enum of `input html` type for if equal
 * @type Checkbox (a special case see Class for more information)
 * @type Email
 * @type Password
 * @type Text
 */
export enum IType {
  Hidden = 'hidden',
  Checkbox = 'checkbox',
  Date = 'date',
  Email = 'email',
  Password = 'password',
  Text = 'text',
  Number = 'number',
  Autocomplete = 'autocomplete',
  Search = 'search',
  Select = 'select',
  Slider = 'slider',
  Radios = 'radios',
  TextArea = 'textarea',
}

export interface IDefaultProps extends FormComponentProps {
  name?: boolean;
  description?: boolean;
  quantity?: boolean;
  price?: boolean;
  vatRate?: boolean;
  autoFocus?: boolean;
  autoComplete?: string | undefined;
  children?: React.ReactNode;
  options?: React.ReactNode;
  id: string;
  inputRef?: (node: HTMLInputElement) => void;
  checkboxRef?: (node: Checkbox) => void;
  label: string | React.ReactNode;
  onChange?: (node: React.ChangeEvent, value: string) => void;
  onChangeTextArea?: (node: React.ChangeEvent, value: string) => void;
  onChangeDate?: (date: Moment, dateString: string) => void;
  onChangeCheck?: (node: CheckboxChangeEvent, value: boolean) => void;
  onChangeSelect?: (
    value: Moment,
    option: React.ReactElement<any> | Array<React.ReactElement<any>>,
  ) => void;
  onCheck?: (node: CheckboxChangeEvent) => void;
  format?: string;
  placeholder?: string;
  rules: InputRules[];
  validateTrigger?: string | string[];
  type: IType;
  hint?: string | React.ReactNode;

  open?: boolean;
  getCalendarContainer?: () => HTMLElement;
  size?: string;
  maxLength?: number;
  disabled?: boolean;
  labelInValue?: boolean;
  filterOption?: boolean;
  value?: any;
  values?: any;
  defaultValue?: any;
  defaultChecked?: any;
  className?: string;
  // addonBefore?: PropTypes.ReactNodeLike;
  // addonAfter?: PropTypes.ReactNodeLike;
  onPressEnter?: (...args: any[]) => any;
  onKeyDown?: (...args: any[]) => any;
  onKeyUp?: (...args: any[]) => any;
  onFocus?: (...args: any[]) => any;
  onBlur?: (...args: any[]) => any;
  onSearch?: (...args: any[]) => any;
  tipFormatter?: (value: number) => React.ReactNode;
  range?: boolean;
  prefix?: string | React.ReactNode;
  showSearch?: boolean;
  suffix?: string | React.ReactNode;
  enterButton?: React.ReactNode;
  small?: boolean;
  marge?: boolean;
  mode?: 'default' | 'multiple' | 'tags' | 'combobox' | string;
}

/**
 * Default State
 *
 * error is set by antd `getFieldDecorator`
 * @see https://ant.design/components/form/
 */
export interface IDefaultState {
  defaultValue?: any;
  value?: any;
  active?: boolean;
  autofill?: boolean;
  error?: string;
}

/**
 * IDefault (input default)
 *
 * This is the base class used for inputs inside all the application
 */
class IDefault extends React.PureComponent<IDefaultProps, IDefaultState> {
  /** DEFAULT PROPS */
  static defaultProps: Partial<IDefaultProps> = {
    id: 'text',
    label: 'text',
    rules: [],
    type: IType.Text,
  };

  static getDerivedStateFromProps(props: IDefaultProps, state: IDefaultState) {
    if (props.defaultValue !== state.defaultValue && props.defaultValue) {
      return {
        active: true,
        defaultValue: props.defaultValue,
        value: props.defaultValue,
      };
    } else if (
      props.defaultValue !== state.defaultValue &&
      !props.defaultValue
    ) {
      return {
        active: false,
        defaultValue: props.defaultValue,
        value: props.defaultValue,
      };
    }
    return state;
  }

  /** DEFAULT STATE */
  state: Partial<IDefaultState> = {
    active: undefined,
    autofill: true,
    defaultValue: undefined,
    error: undefined,
    value: undefined,
  };

  /** ATTRIBUTES */
  handleInnerRef: (node: any) => void;
  handleChange?: (event: React.FocusEvent<HTMLInputElement>) => any;
  handleChangeTextArea?: (event: React.ChangeEvent<HTMLTextAreaElement>) => any;
  handleChangeCheck?: (event: CheckboxChangeEvent) => any;
  handleChangeDate?: (date: Moment, dateString: string) => any;
  handleChangeNumber?: (value: string | number | undefined) => any;
  handleChangeRadio?: (event: RadioChangeEvent) => any;
  handleChangeSelect?: (
    value: Moment,
    option: React.ReactElement<any> | Array<React.ReactElement<any>>,
  ) => void;
  handleOpenChangePopup?: (status: boolean) => any;
  handleBlur?: (event: React.FocusEvent<HTMLInputElement>) => any;
  handleFocus?: (event: React.FocusEvent<HTMLInputElement>) => any;
  handleBlurRef?: () => any;
  handleFocusRef?: () => any;

  /**
   * @function innerRef
   * Dispatch node if checkbox or input to the right parent function
   */
  nodeRef: Input | Checkbox | React.ClassicComponent | null = null;

  /** CONSTRUCTOR */
  constructor(props: any) {
    super(props);

    this.handleInnerRef = this.innerRef.bind(this);
    this.handleChange = this.change.bind(this);
    this.handleChangeTextArea = this.changeTextArea.bind(this);
    this.handleChangeDate = this.changeDate.bind(this);
    this.handleChangeRadio = this.changeRadio.bind(this);
    this.handleChangeNumber = this.changeNumber.bind(this);
    this.handleChangeSelect = this.changeSelect.bind(this);
    this.handleChangeCheck = this.changeCheck.bind(this);
    this.handleOpenChangePopup = this.openChangePopup.bind(this);
    this.handleBlur = this.blur.bind(this);
    this.handleFocus = this.focus.bind(this);
    this.handleBlurRef = this.blurRef.bind(this);
    this.handleFocusRef = this.focusRef.bind(this);
  }

  blur(event: React.FocusEvent<HTMLInputElement>) {
    const { onBlur } = this.props;
    if (event.currentTarget && event.currentTarget.value === '') {
      this.setState({ active: false });
    }
    onBlur && onBlur();
  }

  focus(event: React.FocusEvent<HTMLInputElement>) {
    const { onFocus } = this.props;
    this.setState({ active: true });
    onFocus && onFocus();
  }

  blurRef() {
    const { onBlur } = this.props;
    if (this.state.value === '' || this.state.value === null) {
      this.setState({ active: false });
    }
    onBlur && onBlur();
  }

  focusRef() {
    const { onFocus } = this.props;
    this.setState({ active: true });
    onFocus && onFocus();
  }

  change(event: React.FocusEvent<HTMLInputElement>) {
    const {
      onChange,
      quantity,
      price,
      vatRate,
      name,
      description,
    } = this.props;
    const { autofill } = this.state;

    if (autofill) {
      if (event.currentTarget.value !== '') {
        this.setState({ autofill: false, active: true });
      } else {
        this.setState({ autofill: false });
      }
    }

    if (name || description) {
      const input = event.currentTarget.value;
      if (name && input.length >= 100) {
        return;
      }
      if (description && input.length >= 150) {
        return;
      }
    } else {
      let value;
      let isInt;
      if (quantity || price || vatRate) {
        if (event.currentTarget.value !== '') {
          isInt = /^\d+$/.test(event.currentTarget.value);
          value = Number(event.currentTarget.value);
          if (isNaN(value)) {
            return;
          }
          if (quantity && !isInt) {
            return;
          }
          if ((quantity || price) && value < 0) {
            return;
          }
          if (vatRate && (value < 0 || value > 100)) {
            return;
          }
        }
      }
    }

    this.setState({ value: event.currentTarget.value }, () => {
      onChange && onChange(event, this.state.value);
    });
  }

  changeCheck(event: CheckboxChangeEvent) {
    const { onChangeCheck } = this.props;
    const { autofill } = this.state;

    // if (autofill) {
    //   if (event.target.checked !== '') {
    //     this.setState({ autofill: false, active: true });
    //   } else {
    //     this.setState({ autofill: false });
    //   }
    // }
    this.setState({ value: event.target.checked });
    onChangeCheck && onChangeCheck(event, event.target.checked);
  }

  changeTextArea(event: React.ChangeEvent<HTMLTextAreaElement>) {
    const { onChangeTextArea } = this.props;
    const { autofill } = this.state;

    if (autofill) {
      if (event.currentTarget.value !== '') {
        this.setState({ autofill: false, active: true });
      } else {
        this.setState({ autofill: false });
      }
    }
    this.setState({ value: event.currentTarget.value });
    onChangeTextArea && onChangeTextArea(event, event.currentTarget.value);
  }

  changeNumber(value: string | number | undefined) {
    this.setState({
      value,
    });
  }

  changeRadio(e: RadioChangeEvent) {
    this.setState({
      value: e.target.value,
    });
  }

  changeDate(date: Moment, dateString: string) {
    const { onChangeDate } = this.props;
    const { autofill } = this.state;

    if (autofill) {
      if (date === null) {
        this.setState({ autofill: false });
      } else {
        this.setState({ autofill: false, active: true });
      }
    }
    this.setState({ value: date });
    onChangeDate && onChangeDate(date, dateString);
  }

  changeSelect(
    value: Moment,
    option: React.ReactElement<any> | Array<React.ReactElement<any>>,
  ) {
    const { onChangeSelect } = this.props;
    const { autofill } = this.state;

    if (autofill) {
      if (value === null) {
        this.setState({ autofill: false });
      } else {
        this.setState({ autofill: false, active: true });
      }
    }
    this.setState({ value });
    onChangeSelect && onChangeSelect(value, option);
  }

  openChangePopup(status: boolean) {
    // console.log('openChangePopup');
    // const { autofill } = this.state;
    // if (autofill) {
    //   if (date === null) {
    //     this.setState({ autofill: false });
    //   } else {
    //     this.setState({ autofill: false, active: true });
    //   }
    // }
  }

  checkAutofill() {
    if (this.nodeRef !== null) {
      const ref = this.nodeRef;
      if (ref instanceof Input) {
        setTimeout(() => {
          let autofilled = false;
          try {
            autofilled = ref.input.matches(':autofill');
          } catch (error) {
            try {
              autofilled = ref.input.matches(':-webkit-autofill');
            } catch (error) {
              try {
                autofilled = ref.input.matches(':-moz-autofill');
              } catch (error) {}
            }
          }
          if (autofilled) {
            this.setState({ active: true });
          }
        }, 1000);
      }
    }
  }

  innerRef(node: any) {
    const { inputRef, checkboxRef } = this.props;
    this.nodeRef = node;
    if (node instanceof Input && inputRef) {
      inputRef(node.input);
    } else if (node instanceof Checkbox && checkboxRef) {
      checkboxRef(node);
    }
    this.checkAutofill();
  }

  getPopupContainer = (triggerNode: Element | undefined) => {
    if (triggerNode) {
      return triggerNode.parentNode as HTMLElement;
    } else {
      return document.body;
    }
  };

  /**
   * @function render
   * render (IType) Input | Checkbox
   */
  render() {
    const {
      autoFocus,
      autoComplete,
      open,
      getCalendarContainer,
      children,
      options,
      defaultValue,
      defaultChecked,
      values,
      className,
      form,
      id,
      label,
      disabled,
      labelInValue,
      filterOption,
      onChange, // Input
      range,
      mode,
      maxLength,
      onCheck, // Checkbox
      placeholder,
      prefix,
      format,
      hint,
      rules,
      validateTrigger,
      showSearch,
      suffix,
      type, // IType
      tipFormatter,
      onSearch,
      enterButton,
      small,
      marge,
    } = this.props;
    const { active } = this.state;

    const getFieldDecorator = form && form.getFieldDecorator;

    let TypedInput = null;
    if (type === IType.Checkbox) {
      TypedInput = (
        <Checkbox
          defaultChecked={defaultChecked}
          className={className}
          ref={this.handleInnerRef}
          onChange={this.handleChangeCheck}
        >
          {label}
        </Checkbox>
      );
    } else if (type === IType.Radios) {
      TypedInput = (
        <Radio.Group onChange={this.handleChangeRadio} className={className}>
          {values &&
            values.map &&
            values.map((radio: any, i: number) => (
              <Radio
                defaultChecked={radio.checked}
                disabled={radio.disabled}
                key={`${i}`}
                value={radio.value}
              >
                {radio.label}
              </Radio>
            ))}
        </Radio.Group>
      );
    } else if (type === IType.Slider) {
      TypedInput = (
        <Slider
          className={className}
          ref={this.handleInnerRef}
          range
          tipFormatter={tipFormatter}
        />
      );
    } else if (type === IType.Search) {
      TypedInput = (
        <Search
          disabled={disabled}
          onSearch={onSearch}
          onFocus={this.handleFocus}
          enterButton={enterButton}
          ref={this.handleInnerRef}
          onBlur={this.handleBlur}
          className={`main-color${className ? ` ${className}` : ''}`}
          prefix={prefix}
          suffix={
            <span>
              {suffix}
              {hint && (
                <Tooltip placement="right" title={hint}>
                  <Icon value={IconValue.Information} />
                </Tooltip>
              )}
            </span>
          }
          autoComplete={autoComplete}
          onChange={this.handleChange}
          type={type}
          placeholder={placeholder || ''}
        />
      );
    } else if (type === IType.Date) {
      const dateProps: any = {};
      if (typeof open !== 'undefined') {
        dateProps.open = open;
      }

      TypedInput = (
        <DatePicker
          defaultValue={defaultValue}
          getCalendarContainer={getCalendarContainer}
          disabled={disabled}
          format={format || 'DD/MM/YYYY'}
          className={`main-color${className ? ` ${className}` : ''}`}
          ref={this.handleInnerRef}
          onChange={this.handleChangeDate}
          onOpenChange={this.openChangePopup}
          placeholder={placeholder || ''}
          {...dateProps}
        />
      );
    } else if (type === IType.Select) {
      TypedInput = (
        <Select
          getPopupContainer={this.getPopupContainer}
          mode={mode}
          onSearch={onSearch}
          labelInValue={labelInValue}
          filterOption={filterOption}
          defaultValue={defaultValue}
          disabled={disabled}
          showSearch={showSearch}
          className={`main-color${className ? ` ${className}` : ''}`}
          ref={this.handleInnerRef}
          onChange={this.handleChangeSelect}
          onFocus={this.handleFocusRef}
          onBlur={this.handleBlurRef}
          placeholder={placeholder || ''}
        >
          {options}
        </Select>
      );
    } else if (type === IType.Number) {
      TypedInput = (
        <InputNumber
          disabled={disabled}
          onFocus={this.handleFocus}
          onBlur={this.handleBlur}
          className={`main-color${className ? ` ${className}` : ''}`}
          ref={this.handleInnerRef}
          onChange={this.handleChangeNumber}
          type={type}
          placeholder={placeholder || ''}
        />
      );
    } else if (type === IType.TextArea) {
      TypedInput = (
        <TextArea
          style={{ height: '115px' }}
          disabled={disabled}
          defaultValue={defaultValue}
          className={`main-color${className ? ` ${className}` : ''}`}
          ref={this.handleInnerRef}
          onChange={this.handleChangeTextArea}
          placeholder={placeholder || ''}
          // autosize={{minRows: 3}}
        />
      );
    } else {
      TypedInput = (
        <Input
          value={this.state.value}
          maxLength={maxLength}
          autoFocus={autoFocus}
          disabled={disabled}
          onFocus={this.handleFocus}
          onBlur={this.handleBlur}
          className={`main-color${className ? ` ${className}` : ''}`}
          prefix={prefix}
          suffix={
            <span>
              {suffix}
              {hint && (
                <Tooltip placement="right" title={hint}>
                  <Icon value={IconValue.Information} />
                </Tooltip>
              )}
            </span>
          }
          autoComplete={autoComplete}
          ref={this.handleInnerRef}
          onChange={this.handleChange}
          type={type}
          placeholder={placeholder || ''}
        />
      );
    }

    let initialValue = defaultValue;
    if (!initialValue && IType.Text) {
      initialValue = '';
    } else if (!initialValue) {
      initialValue = null;
    }

    return (
      // <FormItem
      //   className={`form-item form-item-${type}${active ? ` active` : ''}${
      //     marge === false ? ` no-marge` : ''
      //   }${small ? ` small` : ''}`}
      //   label={
      //     type !== IType.Checkbox &&
      //     type !== IType.Radios &&
      //     type !== IType.Hidden &&
      //     label
      //   }
      // >
      //   {getFieldDecorator
      //     ? getFieldDecorator(id, {
      //         initialValue: defaultValue || null,
      //         rules,
      //         validateTrigger
      //       })(TypedInput)
      //     : TypedInput}
      //   {children}
      // </FormItem>
      <FormItem
        className={`form-item form-item-${type}${active ? ` active` : ''}${
          marge === false ? ` no-marge` : ''
        }${small ? ` small` : ''}`}
        label={
          type !== IType.Checkbox &&
          type !== IType.Radios &&
          type !== IType.Hidden &&
          label
        }
      >
        {TypedInput}
      </FormItem>
    );
  }
}

export default IDefault;
