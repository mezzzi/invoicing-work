import { Card } from 'components/Card';
import { Repie } from 'components/Chart';
import Skeleton from 'components/Skeleton';
import { IInvoice, InvoiceStatus } from 'context/Invoice/types';
import * as Invoices from 'context/Invoices';
import moment from 'moment';
import * as React from 'react';
import { FormattedMessage } from 'react-intl';

interface IProps {
  loading?: boolean;
}
interface IState {}

class BlocChart extends React.PureComponent<IProps, IState> {
  state = {};

  render() {
    let loading = this.props.loading;

    return (
      <Invoices.Provider
        offset={0}
        limit={100}
        filters={{
          enabled: true,
          status: [InvoiceStatus.ToPay, InvoiceStatus.Planned],
        }}
      >
        <Invoices.Consumer>
          {dataInvoices => {
            loading = true;
            if (
              dataInvoices &&
              dataInvoices.invoices &&
              dataInvoices.invoices.data &&
              dataInvoices.invoices.data.loading === false
            ) {
              loading = false;
            }

            const invoices =
              dataInvoices.invoices &&
              dataInvoices.invoices.data &&
              dataInvoices.invoices.data.invoices;

            const rows =
              invoices && invoices.rows
                ? invoices.rows.sort(
                    (a: IInvoice, b: IInvoice) =>
                      new Date(a.dueDate).getTime() -
                      new Date(b.dueDate).getTime(),
                  )
                : undefined;

            const today = moment(new Date());
            let data: any[] | undefined;
            if (rows) {
              data = [];
              rows.map((row: IInvoice) => {
                const dueDate: moment.Moment = moment(row.dueDate);
                if (dueDate.isSameOrAfter(today)) {
                  data && data.push(row);
                }
              });
            }

            return (
              <Card
                title={<FormattedMessage id="dashboard.chart.pie_title" />}
                titleAlign="left"
                center
                shadow
              >
                <div className="chart-dashboard-pie">
                  <Skeleton.Bloc
                    useSpace
                    className="chart-wrapper-outer"
                    loading={Boolean(loading)}
                  >
                    <Repie loading={Boolean(loading)} rows={data} />
                  </Skeleton.Bloc>
                </div>
              </Card>
            );
          }}
        </Invoices.Consumer>
      </Invoices.Provider>
    );
  }
}

export default BlocChart;
