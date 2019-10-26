import { ApolloClient } from 'apollo-client';
import * as Alert from 'context/Alert';
import { ISearchParamType } from 'context/Common/types';
import { removeInvoice, updateInvoiceStatus } from 'context/Invoice/queries';
import * as Upload from 'context/Upload';
import * as React from 'react';
import { compose, graphql, withApollo } from 'react-apollo';
import { InjectedIntlProps, injectIntl } from 'react-intl';
import { errorOrSuccess, parseError } from 'utils';
import { IInvoice, InvoiceStatus } from '../Invoice/types';
import { IInvoicesContextInterface, Provider } from './context';
import { count, invoices } from './queries';

interface IState extends IInvoicesContextInterface {}

interface IProps
  extends InjectedIntlProps,
    Alert.InjectedProps,
    Upload.InjectedProps {
  count: InvoiceStatus[];
  children: React.ReactNode;
  client: ApolloClient<any>;
  removeInvoice: any;
  updateInvoiceStatus: any;
  dataInvoice: any;
  dataScanningInvoice: any;
  dataCount: any;
  id: string;
  filters: any;
  limit: number;
  offset: number;
}

class InvoiceProvider extends React.PureComponent<IProps, IState> {
  static getDerivedStateFromProps(props: IProps, state: IState) {
    const { upload } = props;
    const loading =
      upload && upload.filesUploading && upload.filesUploading.length > 0
        ? true
        : false;

    if (props.dataInvoice && props.dataInvoice.invoices) {
      let shouldPoll = false;

      props.dataInvoice.invoices &&
        props.dataInvoice.invoices.rows &&
        props.dataInvoice.invoices.rows.map((item: any) => {
          if (
            item &&
            !item.error &&
            (item.status === InvoiceStatus.Importing ||
              item.status === InvoiceStatus.Imported ||
              item.status === InvoiceStatus.Scanning)
          ) {
            shouldPoll = true;
          }
        });

      if (!loading && shouldPoll !== state.shouldPoll) {
        if (shouldPoll) {
          props.dataScanningInvoice.startPolling(5000);
        }
        if (!shouldPoll) {
          props.dataScanningInvoice.stopPolling();
        }
        return { shouldPoll };
      }
    }
    return state;
  }

  state = {
    invoices: {
      count: {},
      data: {},
      delete: async (selectedInvoices: IInvoice[], message?: string) => {
        try {
          for (const selectedInvoice of selectedInvoices) {
            const results = await this.props.removeInvoice({
              variables: { id: selectedInvoice.id },
            });
          }

          // user && user.refresh();
          errorOrSuccess(this.props.alert, [], [message || '']);

          this.refresh();
        } catch (e) {
          errorOrSuccess(this.props.alert, parseError(e));
        }
      },
      loading: false,
      more: (params?: ISearchParamType) => {
        const { dataInvoice } = this.props;

        if (this.state && this.state.invoices.loading) {
          return null;
        }

        const length =
          dataInvoice.invoices.rows &&
          dataInvoice.invoices &&
          dataInvoice.invoices.rows &&
          dataInvoice.invoices.rows.length;

        this.setState({
          invoices: {
            ...this.state.invoices,
            loading: true,
          },
        });

        dataInvoice &&
          dataInvoice.fetchMore &&
          dataInvoice.fetchMore({
            updateQuery: (prev: any, { fetchMoreResult }: any) => {
              if (!fetchMoreResult.invoices) {
                return prev;
              }

              this.setState({
                invoices: {
                  ...this.state.invoices,
                  loading: false,
                },
              });
              return {
                invoices: {
                  ...prev.invoices,
                  rows: [
                    ...prev.invoices.rows,
                    ...fetchMoreResult.invoices.rows,
                  ],
                  total: fetchMoreResult.invoices.total,
                },
              };
            },
            variables: {
              limit: 10,
              offset: length || 0,
            },
          });
      },
      // refresh: this.refresh,
      updateStatus: async (
        id: string,
        status: InvoiceStatus,
        message?: string,
      ) => {
        try {
          const { errors, data } = await this.props.updateInvoiceStatus({
            variables: { id, status },
          });

          // user && user.refresh();
          errorOrSuccess(this.props.alert, [], message ? [message] : undefined);
          // this.state.invoices.refresh && this.state.invoices.refresh();
          return data.updateInvoiceStatus;
        } catch (e) {
          errorOrSuccess(this.props.alert, parseError(e));
        }
      },
    },
    shouldPoll: false,
  };

  refresh = () => {
    this.props.dataInvoice && this.props.dataInvoice.refetch();
  };

  componentDidMount = () => {
    const { upload } = this.props;
    upload && upload.on(this.refresh);
  };

  componentWillUnmount = () => {
    const { upload } = this.props;
    upload && upload.off(this.refresh);
  };

  render() {
    const { dataInvoice, dataCount } = this.props;

    return (
      <Provider
        value={{
          ...this.state,
          invoices: {
            ...this.state.invoices,
            count: dataCount,
            data: dataInvoice,
          },
        }}
      >
        {this.props.children}
      </Provider>
    );
  }
}

const invoicesHandler = {
  options: (props: any) => {
    return {
      fetchPolicy: 'network-only',
      variables: {
        filters: props.filters,
        limit: props.limit,
        offset: props.offset,
      },
    };
  },
  props: (props: any) => {
    return {
      dataInvoice: props.data,
    };
  },
  skip: (props: any) => props.count,
};

const invoicesScanningHandler = {
  options: (props: any) => {
    return {
      fetchPolicy: 'network-only',
      variables: {
        filters: {
          enabled: true,
          status: [
            InvoiceStatus.Importing,
            InvoiceStatus.Imported,
            InvoiceStatus.Scanning,
          ],
        },
      },
    };
  },
  props: (props: any) => {
    return {
      dataScanningInvoice: props.data,
    };
  },
};

const countHandler = {
  options: (props: any) => {
    return {
      fetchPolicy: 'network-only',
      limit: 1,
      variables: {
        filters: {
          enabled: true,
          status: props.count,
        },
        offset: 0,
      },
    };
  },
  props: (props: any) => {
    return {
      dataCount: props.data,
    };
  },
  skip: (props: any) => !props.count,
};

export default compose(
  withApollo,
  injectIntl,
  Alert.hoc(),
  Upload.hoc(),
  graphql(removeInvoice, { name: 'removeInvoice' }),
  graphql(invoices, invoicesHandler),
  graphql(invoices, invoicesScanningHandler),
  graphql(count, countHandler),
  graphql(updateInvoiceStatus, { name: 'updateInvoiceStatus' }),
)(InvoiceProvider as any);
