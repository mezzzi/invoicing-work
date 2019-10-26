import * as Balance from 'context/Balance';
import * as Invoice from 'context/Invoice';
import { IInvoice, InvoiceStatus } from 'context/Invoice/types';
import * as Invoices from 'context/Invoices';
import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import Bill from './Bill';

interface IProps extends RouteComponentProps {}
interface IState {}

class PurchaseBills extends React.PureComponent<IProps, IState> {
  state = {};

  more = async (fetchMore: any, total: number, length: number) => {
    if (fetchMore) {
      await fetchMore({
        updateQuery: (prev: any, { fetchMoreResult }: any) => {
          if (!fetchMoreResult.invoices) {
            return prev;
          }

          return {
            ...prev,
            invoices: {
              ...prev.invoices,
              rows: [...prev.invoices.rows, ...fetchMoreResult.invoices.rows],
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

  onSelect = (invoice?: IInvoice) => {
    this.setState({
      detailInvoice: invoice,
      detailInvoiceId: invoice ? invoice.id : undefined,
      selectContacts: false,
    });
  };

  onSelectContacts = () => {
    this.setState({
      detailInvoice: undefined,
      detailInvoiceId: undefined,
      selectContacts: true,
    });
  };

  render() {
    return (
      <Balance.Provider>
        <Balance.Consumer>
          {({ balance }) => {
            return (
              <Invoices.Provider
                offset={0}
                limit={12}
                filters={{
                  enabled: true,
                  status: [
                    InvoiceStatus.ToPay,
                    InvoiceStatus.Planned,
                    InvoiceStatus.Paid,
                  ],
                }}
              >
                <Invoices.Consumer>
                  {data => {
                    const dataInvoices = data.invoices && data.invoices.data;
                    const remove = data.invoices && data.invoices.delete;
                    const updateStatus =
                      data.invoices && data.invoices.updateStatus;

                    const invoices = dataInvoices && dataInvoices.invoices;

                    const hasMore =
                      invoices &&
                      invoices.rows &&
                      invoices.total &&
                      invoices.rows.length < invoices.total;

                    return (
                      <Invoice.Provider>
                        <Invoice.Consumer>
                          {({ invoice }) => {
                            return (
                              <Bill
                                more={this.more}
                                hasMore={hasMore}
                                invoices={invoices && invoices.rows}
                                total={invoices && invoices.total}
                                updateStatus={updateStatus}
                                remove={remove}
                                payout={invoice && invoice.payout}
                                payoutContacts={
                                  invoice && invoice.payoutContacts
                                }
                                generateCode={invoice && invoice.generateCode}
                                checkBalance={balance && balance.checkBalance}
                              />
                            );
                          }}
                        </Invoice.Consumer>
                      </Invoice.Provider>
                    );
                  }}
                </Invoices.Consumer>
              </Invoices.Provider>
            );
          }}
        </Balance.Consumer>
      </Balance.Provider>
    );
  }
}

export default PurchaseBills;
