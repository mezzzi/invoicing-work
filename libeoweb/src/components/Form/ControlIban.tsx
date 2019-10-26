import { Tag } from 'antd';
import ApolloClient from 'apollo-client';
import { Icon } from 'components/Assets';
import { IconValue } from 'components/Assets/Icon';
import { Option, Select, Text } from 'components/Form';
import * as Iban from 'context/Iban';
import { checkIban } from 'context/Iban/queries';
import { IbanStatus, IIban } from 'context/Iban/types';
import * as React from 'react';
import { compose, withApollo } from 'react-apollo';
import { FormattedMessage, InjectedIntlProps, injectIntl } from 'react-intl';
import { isIban } from 'utils/common';

interface IProps extends Iban.InjectedProps, InjectedIntlProps {
  id: string;
  dropdown: boolean;
  showNew: boolean;
  client: ApolloClient<any>;
  form: any;
  value: string;
  onChange?: (iban: any) => void;
}

interface IState {
  ibanStatus?: any;
  ibanStatusError: boolean;
  isNew: boolean;
  ibans: string[];
  value?: string;
}

class ControlIban extends React.PureComponent<IProps, IState> {
  static getDerivedStateFromProps(props: IProps, state: IState) {
    const { iban } = props;
    const ibans = iban && iban.ibans && iban.ibans.rows;
    let currentValue = state.value;

    let newState = null;
    if (!state.value && props.value) {
      currentValue = props.value;
      newState = {
        value: props.value,
      };
    }

    const newIbans: string[] = [];
    let found = false;
    if (ibans) {
      ibans.filter(item => {
        if (item.iban === currentValue) {
          found = true;
        }
        if (props.value === item.iban) {
          return false;
        }
        if (currentValue === item.iban) {
          return false;
        }
        newIbans.push(item.iban);
      });
    }
    if (props.value && props.value !== '' && currentValue !== props.value) {
      newIbans.unshift(props.value);
    }
    if (currentValue && currentValue !== '') {
      newIbans.unshift(currentValue);
    }

    newState = {
      ...newState,
      ibans: newIbans,
      isNew: !found,
    };

    return newState;
  }
  state = {
    ibanStatus: undefined,
    ibanStatusError: false,
    ibans: [],
    isNew: false,
    value: undefined,
  };

  handleRenderIban: (row: any, i: number) => React.ReactNode;

  constructor(props: any) {
    super(props);

    this.handleRenderIban = this.renderIban.bind(this);
  }

  renderIban(row: any, i: number) {
    return <div>{row.iban}</div>;
  }

  onChangeIbanValue = async (iban: string, id?: string) => {
    const test = isIban(iban);
    let ibanStatus: any;

    if (test) {
      if (!id) {
        const { data } = await this.props.client.query({
          query: checkIban,
          variables: { iban },
        });
        ibanStatus = data.checkIban;
      } else {
        ibanStatus = {
          status: IbanStatus.PASSED,
        };
      }
    } else if (iban !== '') {
      ibanStatus = {
        status: IbanStatus.FAILED,
      };
    }

    this.props.onChange && this.props.onChange(ibanStatus);

    this.setState({
      ibanStatus,
      value: iban,
    });
  };

  onChangeIban = async (
    value: any,
    option: React.ReactElement<any> | Array<React.ReactElement<any>>,
  ) => {
    await this.onChangeIbanValue(value);
  };

  onChange = async (node: React.ChangeEvent<Element>) => {
    const target: any = node.currentTarget;
    await this.onChangeIbanValue(target.value.trim());
  };

  getIban(ibans: IIban[], value: string) {
    return ibans && ibans.find(iban => value === iban.iban);
  }

  async componentDidMount() {
    const { value, iban } = this.props;

    if (value && value !== '') {
      const ibans = iban && iban.ibans && iban.ibans.rows;
      const found =
        ibans && ibans.find((item: IIban, i) => value === item.iban);

      if (!found) {
        await this.onChangeIbanValue(value);
      }
    }
  }

  keyUp = (value: string) => {
    this.setState({ value });
  };

  render() {
    const { form, intl, showNew, dropdown, value, ...rest } = this.props;
    const { isNew, ibans } = this.state;
    const ibanStatus: any = this.state.ibanStatus;

    let ibanStatusIcon: React.ReactNode;

    if (typeof ibanStatus !== 'undefined' && ibanStatus && ibanStatus.status) {
      switch (ibanStatus.status) {
        case IbanStatus.BLACKLIST:
          ibanStatusIcon = (
            <div className="iban-error">
              <Icon value={IconValue.Cross} />
            </div>
          );
          break;
        case IbanStatus.FAILED:
          ibanStatusIcon = (
            <div className="iban-error">
              <Icon value={IconValue.Cross} />
            </div>
          );
          break;
        case IbanStatus.FAKE:
          ibanStatusIcon = (
            <div className="iban-error">
              <Icon value={IconValue.Cross} />
            </div>
          );
          break;
        case IbanStatus.PASSED:
          ibanStatusIcon = (
            <div className="iban-success">
              <Icon value={IconValue.Checkmark} />
            </div>
          );
          break;
      }
    }

    const suffix = (
      <>
        {showNew &&
          isNew &&
          ibanStatus &&
          ibanStatus.status === IbanStatus.PASSED && (
            <Tag>{<FormattedMessage id="common.control.iban_new" />}</Tag>
          )}
        {ibanStatusIcon}
      </>
    );

    return dropdown ? (
      <Select
        {...rest}
        suffix={suffix}
        onChangeSelect={this.onChangeIban}
        defaultValue={value}
        showSearch
        onInputKeyUp={this.keyUp}
        form={form}
        filterOption={false}
        label={<FormattedMessage id="common.control.iban" />}
        id={'iban'}
        rules={[
          {
            message: intl.formatMessage({
              id: 'common.control.iban_error',
            }),
            required: true,
          },
        ]}
        options={
          ibans
            ? ibans.map((item: string, i: number) => {
                return (
                  item &&
                  item !== '' && (
                    <Option value={item} key={item}>
                      {item}
                    </Option>
                  )
                );
              })
            : []
        }
      />
    ) : (
      <Text
        {...rest}
        suffix={suffix}
        onChange={this.onChange}
        defaultValue={value}
        showSearch
        onInputKeyUp={this.keyUp}
        id="iban"
        label={<FormattedMessage id="common.control.iban" />}
        rules={[
          {
            message: intl.formatMessage({
              id: 'common.control.iban_error',
            }),
            required: true,
          },
        ]}
        form={form}
      />
    );
  }
}

export default compose(
  withApollo,
  injectIntl,
  Iban.hoc(),
)(ControlIban);
