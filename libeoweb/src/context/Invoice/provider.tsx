import { ApolloClient } from 'apollo-client';
import * as Alert from 'context/Alert';
import * as Upload from 'context/Upload';
import * as React from 'react';
import { compose, graphql, withApollo } from 'react-apollo';
import { InjectedIntlProps, injectIntl } from 'react-intl';
import { errorOrSuccess, parseError } from 'utils';
import { IInvoiceContextInterface, Provider } from './context';
import {
  generateCode,
  invoice,
  payout,
  payoutContacts,
  removeInvoice,
  updateInvoice,
  updateInvoiceStatus,
} from './queries';
import { IInvoice, InvoiceStatus, IUpdateInvoiceInput } from './types';

interface IState extends IInvoiceContextInterface {}

interface IProps
  extends InjectedIntlProps,
    Alert.InjectedProps,
    Upload.InjectedProps {
  removeInvoice: any;
  generateCode: any;
  payout: any;
  updateInvoice: any;
  updateInvoiceStatus: any;
  payoutContacts: any;
  children: React.ReactNode;
  client: ApolloClient<any>;
  dataInvoice: any;
  id: string;
  limit: number;
  offset: number;
}

class InvoiceProvider extends React.PureComponent<IProps, IState> {
  state = {
    invoice: {
      data: {},
      delete: async (id: string) => {
        try {
          const { errors } = await this.props.removeInvoice({
            variables: { id },
          });

          // user && user.refresh();
          errorOrSuccess(this.props.alert, parseError(errors), [
            'purchase.footer.delete_invoice_success',
          ]);
        } catch (e) {
          errorOrSuccess(this.props.alert, parseError(e));
        }
      },
      generateCode: async (invoiceId: string) => {
        try {
          const { errors } = await this.props.generateCode({
            variables: { invoiceId },
          });

          errorOrSuccess(this.props.alert, parseError(errors), []);
        } catch (e) {
          errorOrSuccess(this.props.alert, parseError(e));
        }
      },
      payout: async (invoiceId: string, date?: Date, code?: string) => {
        try {
          const { errors, data } = await this.props.payout({
            variables: {
              code,
              date,
              invoiceId,
            },
          });

          errorOrSuccess(this.props.alert, parseError(errors));

          return (
            data.payout &&
            data.payout.find((item: IInvoice) => item.id === invoiceId)
          );
        } catch (e) {
          errorOrSuccess(this.props.alert, parseError(e));
        }

        return false;
      },
      payoutContacts: async (invoiceId: string, contactsIds?: string[]) => {
        try {
          const { errors, data } = await this.props.payoutContacts({
            variables: {
              contactsIds,
              invoiceId,
            },
          });

          errorOrSuccess(this.props.alert, parseError(errors));
        } catch (e) {
          errorOrSuccess(this.props.alert, parseError(e));
        }

        return false;
      },
      update: async (
        id: string,
        input: IUpdateInvoiceInput,
        message: string,
      ) => {
        try {
          const { errors, data } = await this.props.updateInvoice({
            variables: { id, input },
          });

          // user && user.refresh();
          errorOrSuccess(
            this.props.alert,
            parseError(errors),
            message ? [message] : undefined,
          );

          return data.updateInvoice;
        } catch (e) {
          errorOrSuccess(this.props.alert, parseError(e));
        }
      },
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
          errorOrSuccess(
            this.props.alert,
            parseError(errors),
            message ? [message] : undefined,
          );
          return (
            data.updateInvoiceStatus &&
            data.updateInvoiceStatus.find((item: IInvoice) => item.id === id)
          );
        } catch (e) {
          errorOrSuccess(this.props.alert, parseError(e));
        }
      },
    },
  };

  refresh = () => {
    this.props.dataInvoice && this.props.dataInvoice.refetch();
  };

  componentDidMount() {
    const { upload } = this.props;
    upload && upload.on(this.refresh);
  }

  componentWillUnmount() {
    const { upload } = this.props;
    upload && upload.off(this.refresh);
  }

  render() {
    const { dataInvoice } = this.props;

    return (
      <Provider
        value={{
          invoice: {
            ...this.state.invoice,
            data: dataInvoice,
          },
        }}
      >
        {this.props.children}
      </Provider>
    );
  }
}

const invoiceHandler = {
  options: (props: any) => {
    return {
      variables: {
        id: props.id,
        isAR: props.isAR,
      },
    };
  },
  props: (props: any) => {
    return {
      dataInvoice: props.data,
    };
  },
  skip: (props: any) => !props.id,
};

export default compose(
  withApollo,
  injectIntl,
  Alert.hoc(),
  Upload.hoc(),
  graphql(invoice, invoiceHandler),
  graphql(payout, { name: 'payout' }),
  graphql(generateCode, { name: 'generateCode' }),
  graphql(removeInvoice, { name: 'removeInvoice' }),
  graphql(updateInvoice, { name: 'updateInvoice' }),
  graphql(updateInvoiceStatus, { name: 'updateInvoiceStatus' }),
  graphql(payoutContacts, { name: 'payoutContacts' }),
)(InvoiceProvider as any);
