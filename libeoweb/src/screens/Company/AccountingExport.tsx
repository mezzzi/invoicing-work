import { Row } from 'antd';
import { Icon } from 'components/Assets';
import { IconValue } from 'components/Assets/Icon';
import Infinity from 'components/Infinity';
import { Content } from 'components/Layout';
import { Table } from 'components/Table';
import { A, Heading, SubHeading } from 'components/Typo';
import * as AccountingCtx from 'context/Accounting';
import { IAccountingExport } from 'context/Accounting/types';
import * as React from 'react';
import { FormattedMessage, InjectedIntlProps, injectIntl } from 'react-intl';
import { RouteComponentProps } from 'react-router';
import { NavLink } from 'react-router-dom';
import { staticAssets, toPickerDate } from 'utils/common';
import './AccountingExport.module.less';

interface IProps extends RouteComponentProps, InjectedIntlProps {}

interface IState {}

class AccountingExport extends React.PureComponent<IProps, IState> {
  state = {};

  constructor(props: any) {
    super(props);
  }

  handleExport = async (accountingExports: any, refetch: () => void) => {
    if (accountingExports) {
      const url = await accountingExports();
      if (url) {
        window.open(staticAssets(url), '_blank');
        await refetch();
      }
    }
  };

  onDownload = (row: IAccountingExport) => {
    if (row.fileLink) {
      window.open(staticAssets(row.fileLink), '_blank');
    }
  };

  more = async (fetchMore: any, total: number, length: number) => {
    if (fetchMore) {
      await fetchMore({
        updateQuery: (prev: any, { fetchMoreResult }: any) => {
          if (!fetchMoreResult.exports) {
            return prev;
          }

          return {
            ...prev,
            exports: {
              ...prev.exports,
              rows: [...prev.exports.rows, ...fetchMoreResult.exports.rows],
            },
          };
        },
        variables: {
          limit: 10,
          offset: length || 0,
        },
      });
    }
  };

  render() {
    const { intl } = this.props;

    return (
      <AccountingCtx.Provider export limit={16} offset={0}>
        <AccountingCtx.Consumer>
          {({ accounting }) => {
            const accountingExports =
              (accounting &&
                accounting.accountingExports &&
                accounting.accountingExports.exports) ||
              [];

            const total = accountingExports ? accountingExports.total : 0;
            const rows = accountingExports ? accountingExports.rows : null;

            return (
              <Infinity
                hasMore={rows ? total > rows.length : false}
                loadMore={this.more.bind(
                  null,
                  accounting &&
                    accounting.accountingExports &&
                    accounting.accountingExports.fetchMore,
                  total,
                  rows ? rows.length : 0,
                )}
              >
                <Content key="table-export">
                  <Row type="flex">
                    <Heading
                      icon={IconValue.Export}
                      title={'accounting_export.header.title'}
                      description={'accounting_export.header.description'}
                      button={'accounting_export.header.button'}
                      buttonCta={'accounting_export.header.button_cta'}
                      onClick={this.handleExport.bind(
                        null,
                        accounting && accounting.export,
                        accounting &&
                          accounting.accountingExports &&
                          accounting.accountingExports.refetch,
                      )}
                    />
                    <SubHeading title={'accounting_export.subheader.title'}>
                      <NavLink to="/company/accounting/options">
                        <A tag="div">
                          <Icon value={IconValue.Gear} />
                          <FormattedMessage id="accounting_export.subheader.link" />
                        </A>
                      </NavLink>
                    </SubHeading>
                    {rows && (
                      <Table
                        className="table-export"
                        rows={rows}
                        columns={[
                          {
                            dataIndex: 'createdAt',
                            key: 'createdAt',
                            render: (value: any, row: any, index: any) => {
                              return (
                                row.createdAt &&
                                toPickerDate(row.createdAt).format('DD/MM/YYYY')
                              );
                            },
                            title: intl.formatMessage({
                              id: 'accounting_export.table.createdAt',
                            }),
                          },
                          {
                            dataIndex: 'fileLink',
                            key: 'fileLink',
                            render: (value: any, row: any, index: any) => {
                              const match = value.match(/([^\/]*?)\.csv/);
                              return (match && match[1]) || '';
                            },
                            title: intl.formatMessage({
                              id: 'accounting_export.table.fileLink',
                            }),
                          },
                          {
                            dataIndex: 'csv',
                            key: 'csv',
                            render: (value: any, row: any, index: any) => {
                              return 'CSV';
                            },
                            title: intl.formatMessage({
                              id: 'accounting_export.table.csv',
                            }),
                          },
                          {
                            className: 'td-pointer',
                            dataIndex: 'download',
                            key: 'download',
                            render: (value: any, row: any, index: any) => {
                              return (
                                <div onClick={this.onDownload.bind(null, row)}>
                                  <Icon value={IconValue.Download} />
                                </div>
                              );
                            },
                            title: intl.formatMessage({
                              id: 'accounting_export.table.download',
                            }),
                          },
                        ]}
                      />
                    )}
                  </Row>
                </Content>
              </Infinity>
            );
          }}
        </AccountingCtx.Consumer>
      </AccountingCtx.Provider>
    );
  }
}

export default injectIntl(AccountingExport);
