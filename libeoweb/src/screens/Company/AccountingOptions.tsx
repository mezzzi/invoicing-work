import { Col, Row } from 'antd';
import { IconValue } from 'components/Assets/Icon';
import { Content } from 'components/Layout';
import { TagManager } from 'components/Rich';
import { Heading } from 'components/Typo';
import * as AccountingCtx from 'context/Accounting';
import { AccountingPreferenceType } from 'context/Accounting/types';
import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import './AccountingOptions.module.less';

interface IProps extends RouteComponentProps {}

interface IState {}

class AccountingOptions extends React.PureComponent<IProps, IState> {
  state = {};

  constructor(props: any) {
    super(props);
  }

  render() {
    const types: {
      [key: string]: {
        common?: boolean;
        add?: boolean;
        editDescription?: boolean;
        editLabel?: boolean;
        editValue?: boolean;
        hasDescription?: boolean;
        remove?: boolean;
        reorder?: boolean;
        types: AccountingPreferenceType[];
      };
    } = {};

    types.LEDGER = {
      common: false,
      editDescription: true,
      editValue: true,
      reorder: false,
      types: [
        AccountingPreferenceType.LEDGER_BANK,
        AccountingPreferenceType.LEDGER_PURCHASE,
        AccountingPreferenceType.LEDGER_SALES,
        AccountingPreferenceType.LEDGER_MISC,
      ],
    };

    types.BANK_ACCOUNT = {
      common: false,
      editDescription: true,
      editLabel: true,
      editValue: true,
      hasDescription: true,
      reorder: false,
      types: [
        AccountingPreferenceType.BANK_ACCOUNT,
        AccountingPreferenceType.BANK_ACCOUNT_TREEZOR,
      ],
    };

    types.PURCHASE_ACCOUNT = {
      add: true,
      common: false,
      editDescription: true,
      editLabel: true,
      editValue: true,
      hasDescription: true,
      remove: true,
      reorder: true,
      types: [AccountingPreferenceType.PURCHASE_ACCOUNT],
    };

    types.VAT_ACCOUNT = {
      add: false,
      common: false,
      editDescription: true,
      editLabel: true,
      editValue: true,
      hasDescription: true,
      remove: false,
      reorder: false,
      types: [AccountingPreferenceType.VAT_ACCOUNT],
    };

    return (
      <Content>
        <Row type="flex">
          <Heading
            icon={IconValue.Tag}
            title={'accounting_options.header.title'}
            description={'accounting_options.header.description'}
          />
        </Row>
        {Object.keys(types).map((label: string, i: number) => (
          <Row
            key={`${i}`}
            type="flex"
            style={{
              marginBottom: 30,
            }}
          >
            <Col span={24}>
              <AccountingCtx.Provider
                common={types[label].common}
                types={types[label].types as AccountingPreferenceType[]}
              >
                <AccountingCtx.Consumer>
                  {({ accounting }) => {
                    const preferences =
                      (accounting &&
                        accounting.preferences &&
                        accounting.preferences.rows) ||
                      [];

                    return (
                      <TagManager
                        {...{
                          add: types[label].add,
                          editDescription: types[label].editDescription,
                          editLabel: types[label].editLabel,
                          editValue: types[label].editValue,
                          hasDescription: types[label].hasDescription,
                          remove: types[label].remove,
                          reorder: types[label].reorder,
                        }}
                        type={label as AccountingPreferenceType}
                        rows={preferences}
                        title={`accounting_options.${label.toLowerCase()}.title`}
                      />
                    );
                  }}
                </AccountingCtx.Consumer>
              </AccountingCtx.Provider>
            </Col>
          </Row>
        ))}
      </Content>
    );
  }
}

export default AccountingOptions;
