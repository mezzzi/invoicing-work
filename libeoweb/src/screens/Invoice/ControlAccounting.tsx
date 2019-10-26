import { OptionProps } from 'antd/lib/select';
import { Select, SelectOptGroup, SelectOption } from 'components/Form';
import * as AccountingCtx from 'context/Accounting';
import {
  AccountingPreferenceType,
  IAccountingPreference,
} from 'context/Accounting/types';
import * as Iban from 'context/Iban';
import * as React from 'react';
import { compose, withApollo } from 'react-apollo';
import { FormattedMessage, InjectedIntlProps, injectIntl } from 'react-intl';

interface IProps extends Iban.InjectedProps, InjectedIntlProps {
  purchaseAccountId?: string;
  form: any;
}

interface IState {}

class ControlAccounting extends React.PureComponent<IProps, IState> {
  filterOption = (
    inputValue: string,
    option: React.ReactElement<OptionProps>,
  ) => {
    return option.props.children &&
      option.props.children
        .toString()
        .toLowerCase()
        .indexOf(inputValue.toLowerCase()) > -1
      ? true
      : false;
  };

  render() {
    const { purchaseAccountId, intl, form } = this.props;

    return (
      <AccountingCtx.Provider
        common
        types={AccountingPreferenceType.PURCHASE_ACCOUNT}
      >
        <AccountingCtx.Consumer>
          {({ accounting }) => {
            let preferences =
              (accounting &&
                accounting.preferences &&
                accounting.preferences.rows) ||
              [];

            const customRows: any = {
              custom: [],
            };
            const defaultRows: any = {};
            if (preferences) {
              preferences = preferences.sort(
                (a: IAccountingPreference, b: IAccountingPreference) =>
                  parseInt(a.value as string, 10) -
                  parseInt(b.value as string, 10),
              );
              preferences.map((preference, i) => {
                const value: string = (preference.value as string).substring(
                  0,
                  2,
                );

                if (preference.company) {
                  customRows.custom.push(preference);
                } else {
                  if (!defaultRows[value]) {
                    defaultRows[value] = [];
                  }
                  defaultRows[value].push(preference);
                }
              });
            }

            return (
              <Select
                defaultValue={preferences.length > 0 && purchaseAccountId}
                showSearch
                filterOption={this.filterOption}
                id="purchaseAccount"
                label={
                  <FormattedMessage id="purchase.control.purchaseAccount" />
                }
                rules={[
                  {
                    message: intl.formatMessage({
                      id: 'purchase.control.purchaseAccount_error',
                    }),
                    required: true,
                  },
                ]}
                form={form}
                options={[
                  ...Object.keys(customRows).map((key: string, i: number) => (
                    <SelectOptGroup
                      key={`custom-${i}`}
                      label={
                        <FormattedMessage
                          id={`purchase.control.purchaseAccount_${key}`}
                        />
                      }
                    >
                      {customRows[key].map(
                        (preference: IAccountingPreference, j: number) =>
                          preference.enabled ||
                          purchaseAccountId === preference.id ? (
                            <SelectOption
                              key={`custom-${j}`}
                              value={`${preference.id}`}
                            >
                              {preference.key}
                            </SelectOption>
                          ) : (
                            undefined
                          ),
                      )}
                    </SelectOptGroup>
                  )),
                  ...Object.keys(defaultRows).map((key: string, i: number) => (
                    <SelectOptGroup
                      key={`default-${i}`}
                      label={
                        <FormattedMessage
                          id={`purchase.control.purchaseAccount_${key}`}
                        />
                      }
                    >
                      {defaultRows[key].map(
                        (preference: IAccountingPreference, j: number) =>
                          preference.enabled && (
                            <SelectOption
                              key={`default-${j}`}
                              value={`${preference.id}`}
                            >
                              {preference.key}
                            </SelectOption>
                          ),
                      )}
                    </SelectOptGroup>
                  )),
                ]}
              />
            );
          }}
        </AccountingCtx.Consumer>
      </AccountingCtx.Provider>
    );
  }
}

export default compose(
  withApollo,
  injectIntl,
)(ControlAccounting);
