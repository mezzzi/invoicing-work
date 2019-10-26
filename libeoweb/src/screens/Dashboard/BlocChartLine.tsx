import { Card } from 'components/Card';
import { Reline } from 'components/Chart';
import Skeleton from 'components/Skeleton';
import * as Balance from 'context/Balance';
import { IBalanceInterface } from 'context/Balance/context';
import { InvoiceStatus } from 'context/Invoice/types';
import * as Invoices from 'context/Invoices';
import { IInvoicesContextInterface } from 'context/Invoices/context';
import * as React from 'react';
import { FormattedMessage } from 'react-intl';

interface IProps {
  loading?: boolean;
}

const isLoadingInvoices = (data: IInvoicesContextInterface): boolean => {
  if (
    data &&
    data.invoices &&
    data.invoices.data &&
    data.invoices.data.loading === false
  ) {
    return false;
  }
  return true;
};

const isLoadingBalance = (balance?: IBalanceInterface): boolean => {
  if (balance && balance.data && balance.data.loading === false) {
    return false;
  }
  return true;
};

const getAmount = (balance?: IBalanceInterface): number => {
  return balance && balance.data && balance.data.balance
    ? balance.data.balance.currentBalance
    : 0;
};

const BlocLineChart: React.FunctionComponent<IProps> = props => {
  let loading = props.loading;

  return (
    <Balance.Provider balance>
      <Balance.Consumer>
        {({ balance }) => {
          loading = isLoadingBalance(balance);

          return (
            <Invoices.Provider
              offset={0}
              limit={100}
              filters={{
                enabled: true,
                status: [InvoiceStatus.Planned],
              }}
            >
              <Invoices.Consumer>
                {dataInvoices => {
                  const rows =
                    dataInvoices.invoices &&
                    dataInvoices.invoices.data &&
                    dataInvoices.invoices.data.invoices &&
                    dataInvoices.invoices.data.invoices.rows;

                  loading = isLoadingInvoices(dataInvoices);

                  const currentBalance = getAmount(balance);
                  let payout = currentBalance;
                  if (rows && rows.length > 0) {
                    payout = rows[rows.length - 1].estimatedBalance;
                  }

                  return (
                    <Card
                      title={
                        <FormattedMessage id="dashboard.chart.line_title" />
                      }
                      titleAlign="left"
                      center
                      shadow
                    >
                      <div className="chart-dashboard-line">
                        <Skeleton.Bloc
                          block
                          className="chart-dashboard-solde"
                          loading={Boolean(loading)}
                        >
                          <FormattedMessage
                            id="dashboard.chart.line_solde"
                            values={{ solde: currentBalance }}
                          />
                        </Skeleton.Bloc>
                        <Skeleton.Bloc
                          block
                          className="chart-dashboard-description"
                          loading={Boolean(loading)}
                        >
                          <FormattedMessage
                            id="dashboard.chart.line_solde_waiting"
                            values={{ solde: payout }}
                          />
                        </Skeleton.Bloc>
                        <div className="chart-wrapper-outer">
                          <Reline
                            x="paymentAt"
                            y="estimatedBalance"
                            loading={Boolean(loading)}
                            lines={
                              rows
                                ? [
                                    {
                                      estimatedBalance: getAmount(balance),
                                      paymentAt: new Date().getTime(),
                                    },
                                    ...rows,
                                  ]
                                : []
                            }
                          />
                        </div>
                      </div>
                    </Card>
                  );
                }}
              </Invoices.Consumer>
            </Invoices.Provider>
          );
        }}
      </Balance.Consumer>
    </Balance.Provider>
  );
};

export default BlocLineChart;
