import { Col, Row } from 'antd';
import { IconValue } from 'components/Assets/Icon';
import { Content } from 'components/Layout';
import { List } from 'components/Table';
import { Div, Heading } from 'components/Typo';
import * as BalanceCtx from 'context/Balance';
import * as Transactions from 'context/Transactions';
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { RouteComponentProps } from 'react-router';
import './Balance.module.less';
import BalanceCard from './BalanceCard';

interface IProps extends RouteComponentProps {}

interface IState {}

class Balance extends React.PureComponent<IProps, IState> {
  state = {};

  render() {
    return (
      <BalanceCtx.Provider balance>
        <BalanceCtx.Consumer>
          {({ balance }) => (
            // balance &&
            // balance.data &&
            // balance.data.balance && (
            <Transactions.Provider page={0} limit={8}>
              <Transactions.Consumer>
                {data => {
                  const transactions =
                    data.transactions &&
                    data.transactions.data &&
                    data.transactions.data.transactions;
                  const transactionsVariables =
                    data.transactions &&
                    data.transactions.data &&
                    data.transactions.data.transactionsVariables;
                  const pagination = {
                    pageSize: transactionsVariables
                      ? transactionsVariables.limit
                      : 8,
                    total: transactions ? transactions.total : 0,
                  };
                  return (
                    <Content>
                      <Row type="flex">
                        <Heading
                          icon={IconValue.Rocket}
                          title={'balance.header.title'}
                          description={'balance.header.description'}
                          descriptionVariables={{
                            count:
                              transactions &&
                              transactions.rows &&
                              transactions.rows.length,
                          }}
                          right={
                            <BalanceCard
                              amount={
                                balance &&
                                balance.data &&
                                balance.data.balance &&
                                balance.data.balance.currentBalance
                                  ? balance.data.balance.currentBalance
                                  : '0'
                              }
                              currency={
                                balance &&
                                balance.data &&
                                balance.data.balance &&
                                balance.data.balance.currency
                                  ? balance.data.balance.currency
                                  : 'EUR'
                              }
                            />
                          }
                        />
                      </Row>
                      <Row type="flex">
                        <Col>
                          <Div
                            css={{
                              bold: true,
                              fontSize: '16px',
                              primaryColor: true,
                            }}
                          >
                            <FormattedMessage id="balance.table.header_title" />
                          </Div>
                        </Col>
                      </Row>
                      <Row>
                        <Col>
                          <List
                            invoices={transactions}
                            headers={[
                              { key: 'transactionType' },
                              { key: 'description' },
                              { key: 'walletDebitId' },
                              { key: 'chevron' },
                              { key: 'walletCreditId' },
                              { key: 'createdDate' },
                              { key: 'amount' },
                            ]}
                          />
                        </Col>
                      </Row>
                    </Content>
                  );
                }}
              </Transactions.Consumer>
            </Transactions.Provider>
          )
          // )
          }
        </BalanceCtx.Consumer>
      </BalanceCtx.Provider>
    );
  }
}

export default Balance;
