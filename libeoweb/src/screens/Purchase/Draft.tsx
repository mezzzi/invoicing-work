import { Col, Row } from 'antd';
import { BtnType, Button } from 'components/Button';
import Infinity from 'components/Infinity';
import { Content } from 'components/Layout';
import { FloatingActionFooter } from 'components/Layout';
import { Empty, List } from 'components/Table';
import { Heading } from 'components/Typo';
import { IInvoice, InvoiceStatus } from 'context/Invoice/types';
import * as Invoices from 'context/Invoices';
import * as Upload from 'context/Upload';
import { Moment } from 'moment';
import * as React from 'react';
import { compose } from 'react-apollo';
import { FormattedMessage } from 'react-intl';
import { RouteComponentProps } from 'react-router';
import history from 'store/history';

interface IProps extends Upload.InjectedProps, RouteComponentProps {}
interface IState {
  selectedInvoices: IInvoice[];
}

class PurchaseDraft extends React.PureComponent<IProps> {
  state = {
    selectedInvoices: [],
  };

  handleUpload: () => void;
  handleSelectRows: (invoices: IInvoice[]) => void;
  handleDeleteInvoices: (
    remove?: (ids: IInvoice[]) => void,
    message?: string,
    invoices?: IInvoice[],
  ) => void;

  constructor(props: any) {
    super(props);

    this.handleUpload = this.upload.bind(this);
    this.handleDeleteInvoices = this.deleteInvoices.bind(this);
    this.handleSelectRows = this.selectRows.bind(this);
  }

  selectRows(invoices: IInvoice[]) {
    this.setState({ selectedInvoices: invoices });
  }

  deleteInvoices(
    remove?: (invoices: IInvoice[], message?: string) => void,
    message?: string,
    invoices?: IInvoice[],
  ) {
    invoices && remove && remove(invoices, message);
    this.setState({ selectedInvoices: [] });
  }

  upload = () => {
    const { upload } = this.props;
    const setVisibility = upload && upload.setVisibility;
    if (setVisibility) {
      setVisibility(true);
    }
  };

  onClickRow(invoice: IInvoice) {
    history.push(`/invoice/draft/${invoice.id}`);
  }

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

  handleAction = async (
    remove: (
      selectedInvoices: IInvoice[],
      message?: string | undefined,
    ) => void,
    type: string,
    invoice: IInvoice,
    date: Moment,
    code?: string,
  ): Promise<void> => {
    if (type === 'delete') {
      remove && remove([invoice], 'purchase.footer.delete_invoice_success');
    }
  };

  render() {
    const { selectedInvoices } = this.state;

    return (
      <Invoices.Provider
        offset={0}
        limit={12}
        filters={{
          enabled: true,
          status: [
            InvoiceStatus.Scanning,
            InvoiceStatus.Scanned,
            InvoiceStatus.Imported,
            InvoiceStatus.Importing,
          ],
        }}
      >
        <Invoices.Consumer>
          {data => {
            const dataInvoices = data.invoices && data.invoices.data;
            const remove = data.invoices && data.invoices.delete;

            const invoices = dataInvoices && dataInvoices.invoices;

            const hasMore =
              invoices &&
              invoices.rows &&
              invoices.total &&
              invoices.rows.length < invoices.total;

            return (
              <Infinity
                hasMore={hasMore}
                loadMore={this.more.bind(
                  null,
                  dataInvoices && dataInvoices.fetchMore,
                  (invoices && invoices.total) || 0,
                  invoices && invoices.rows ? invoices.rows.length : 0,
                )}
              >
                <Content
                  footer={
                    selectedInvoices.length > 0 && (
                      <FloatingActionFooter
                        visible={selectedInvoices.length > 0}
                      >
                        <div
                          style={{
                            display: 'flex',
                            flex: 1,
                            justifyContent: 'flex-end',
                          }}
                        >
                          <Button
                            onClick={this.handleDeleteInvoices.bind(
                              null,
                              remove,
                              'purchase.footer.delete_invoices_success',
                              selectedInvoices,
                            )}
                            style={{ marginRight: 50 }}
                            type={BtnType.Primary}
                          >
                            <FormattedMessage id="purchase.control.delete_all" />
                          </Button>
                        </div>
                      </FloatingActionFooter>
                    )
                  }
                >
                  <Row type="flex">
                    <Heading
                      button="dashboard.header.upload_btn"
                      onClick={this.handleUpload}
                      title="purchase.control.draft_title"
                      description={
                        invoices && invoices.total > 0
                          ? 'purchase.control.draft_number_of_import_to_control'
                          : undefined
                      }
                      descriptionVariables={{
                        count: invoices && invoices.total,
                      }}
                    />
                  </Row>
                  <Row>
                    <Col>
                      <List
                        empty={
                          <Empty>
                            <Button
                              type={BtnType.Primary}
                              onClick={this.upload}
                            >
                              <FormattedMessage id="purchase.control.upload_more" />
                            </Button>
                          </Empty>
                        }
                        onSelectRows={this.handleSelectRows}
                        onClickRow={this.onClickRow}
                        invoices={invoices}
                        selectable
                        headers={[
                          { key: 'number' },
                          { key: 'importAt' },
                          { key: 'dueDate' },
                          { key: 'receiverTitle' },
                          { key: 'companyEmitter' },
                          { key: 'total' },
                          { key: 'cta' },
                          {
                            actions: [
                              {
                                type: 'download',
                              },
                              {
                                handle:
                                  remove &&
                                  this.handleAction.bind(null, remove),
                                type: 'delete',
                              },
                            ],
                            key: 'actions',
                          },
                        ]}
                      />
                    </Col>
                  </Row>
                </Content>
              </Infinity>
            );
          }}
        </Invoices.Consumer>
      </Invoices.Provider>
    );
  }
}

export default compose(Upload.hoc())(PurchaseDraft);
