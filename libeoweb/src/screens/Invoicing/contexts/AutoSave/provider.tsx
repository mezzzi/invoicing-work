import ApolloClient from "apollo-client";
import gql from "graphql-tag";
import moment from "moment";
import * as React from "react";
import { compose, graphql, withApollo } from "react-apollo";

import {
  ICompany as IInvoiceCompany,
  IProduct
} from "components/Invoicing/types";
import { IInvoiceData } from "components/Invoicing/types";
import { Loading } from "components/Loading";
import * as Invoice from "context/Invoice";
import { createOrUpdateAR, emittedInvoice } from "context/Invoice/queries";
import { emittedInvoices } from "context/Invoices/queries";
import { getMe } from "context/User/queries";

import {
  IInvoice,
  InvoiceStatus,
  IUpdateInvoiceInput
} from "context/Invoice/types";

import { ICompany } from "context/Company/types";

import { Provider } from "screens/Invoicing/contexts/AutoSave/context";

interface IState extends IInvoiceData {
  isLoading: boolean;
  isUpdating: boolean;
}

interface IProps {
  client: ApolloClient<any>;
}

class AutoSaveProvider extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      emitterCompany: {},
      generalInfo: {},
      headerInfo: {},
      isLoading: true,
      isUpdating: false,
      legalNotices: {},
      partner: {},
      pricingInfo: {},
      products: [{ id: "0", order: 0, price: 0, quantity: 0, vatRate: 0 }],
      templateId: "1"
    };
  }

  shouldComponentUpdate(nextProps: any, nextState: any) {
    return this.state.isLoading !== nextState.isLoading;
  }

  componentDidMount() {
    this.populateStateFromDatabase();
  }

  doneLoading = () => {
    this.setState({
      isLoading: false
    });
  };

  populateStateFromDatabase = async (id?: any) => {
    const companyStateSet = await this.setCurrentCompanyState();
    if (companyStateSet) {
      const success = await this.setInvoiceState(id);
      this.doneLoading();
    } else {
      this.doneLoading();
    }
  };

  setCurrentCompanyState = async (): Promise<boolean> => {
    const { client } = this.props;
    const {
      data: {
        me: { currentCompany: companyEmitter }
      },
      errors: meErrors
    } = await client.query({
      query: getMe
    });
    // companyEmitter.name is to guard against empty companyEmitter
    if (companyEmitter && companyEmitter.name) {
      const emitterCompany = this.databaseCompanyToInvoiceCompany(
        companyEmitter
      );
      this.setState({
        arCreatedById: `${companyEmitter.id}`,
        currentCompany: companyEmitter,
        emitterCompany,
        headerInfo: {
          logoUrl: companyEmitter.logoUrl
        },
        // 0 templateId is equivalent to null
        templateId: `${companyEmitter.templatePreference || 0}`
      });
      return true;
    } else {
      return false;
    }
  };

  setInvoiceState = async (id?: any): Promise<boolean> => {
    const { client } = this.props;
    let invoice;
    if (id) {
      const { data, errors } = await client.query({
        query: emittedInvoice,
        variables: { id, isAR: true }
      });
      if (errors) {
        return false;
      }
      invoice = data.invoice;
    } else {
      const { data, errors } = await client.query({
        query: emittedInvoices,
        variables: {
          filters: { status: InvoiceStatus.ArDraft },
          limit: 1,
          offset: 0
        }
      });
      if (errors) {
        return false;
      }
      const invoices = data.emittedInvoices;
      if (!invoices || invoices.total < 1) {
        return false;
      }
      invoice = invoices.rows[0];
    }
    const fetchedInvoice: IInvoiceData = this.getStateFromInvoice(invoice);
    this.setState({
      isUpdating: true,
      ...fetchedInvoice
    });
    return true;
  };

  updateInvoiceData = (changedValues: IInvoiceData) => {
    this.setState(
      {
        ...changedValues
      },
      () => {
        this.persistToDatabase();
      }
    );
  };

  persistToDatabase = () => {
    const { isUpdating, invoiceId } = this.state;
    const input: IUpdateInvoiceInput = this.getInvoiceFromJsonState();

    if (!isUpdating) {
      this.setState({
        isUpdating: true
      });
      this.createOrUpdateInvoice(input, undefined);
    } else {
      this.createOrUpdateInvoice(input, invoiceId);
    }
  };

  getInvoiceFromJsonState = (): IUpdateInvoiceInput => {
    const {
      headerInfo: { contact = {}, documentType = "Quote" } = {},
      emitterCompany = {},
      receiverCompany = {},
      templateId = "1",
      generalInfo: {
        invoiceDueDate: dueDate = moment()
          .add(30, "days")
          .format("DD/MM/YYYY"),
        invoiceDate = moment().format("DD/MM/YYYY"),
        invoiceDetails: invoiceDescription = "Default Description",
        invoiceNumber = "84a55074-ea50-4dbe-9a7e-7588437ccd16",
        invoiceTitle: emitterTitle = "Default Title"
      } = {},
      pricingInfo: {
        discount = 0,
        totalAllWithVat: total = 0,
        totalAllWithoutVat: totalWoT = 0
      } = {},
      partner: { addresses = ["partner address"] } = {},
      legalNotices: displayLegalNotice = {},
      products = [{ id: "0", order: 0, price: 0, quantity: 0, vatRate: 0 }]
    } = this.state;

    const input: IUpdateInvoiceInput = {
      arCreatedById: emitterCompany.id,
      companyEmitterContactDetails: {
        ...contact
      },
      companyEmitterDetails: {
        ...emitterCompany
      },
      companyEmitterId: emitterCompany.id,
      companyReceiverDetails: {
        ...receiverCompany
      },
      currency: "US",
      discount,
      displayLegalNotice,
      documentType,
      dueDate: moment(dueDate, "DD/MM/YYYY").toDate(),
      emitterTitle,
      invoiceDate: moment(invoiceDate, "DD/MM/YYYY").toDate(),
      invoiceDescription,
      number: invoiceNumber,
      products,
      source: "LibeoAR",
      templateId: Number(templateId),
      total,
      totalWoT,
      vatAmounts: { what: "are these?" }
    };

    return input;
  };

  databaseCompanyToInvoiceCompany = (company: ICompany): IInvoiceCompany => {
    if (!company) {
      return {};
    }

    const {
      id,
      name,
      siret,
      vatNumber,
      addresses: { rows } = {
        rows: [
          {
            address1: "fake address1",
            address2: "fake address2",
            city: "fake city",
            zipcode: "fake zipcode"
          }
        ]
      }
    } = company;
    return {
      address1: rows[0].address1,
      address2: rows[0].address2,
      city: rows[0].city,
      id: `${id}`,
      name,
      siret,
      vatNumber,
      zipcode: `${rows[0].zipcode}`
    };
  };

  getStateFromInvoice = (input: IInvoice): IInvoiceData => {
    const {
      companyEmitterDetails,
      companyEmitterContactDetails,
      companyReceiver,
      companyReceiverDetails,
      discount,
      displayLegalNotice,
      documentType,
      dueDate,
      emitterTitle,
      id: invoiceId,
      invoiceDate,
      invoiceDescription,
      products,
      source,
      total,
      totalWoT
    } = input;
    const receiverCompany = this.databaseCompanyToInvoiceCompany(
      companyReceiver
    );

    const { headerInfo } = this.state;
    const invoiceData: IInvoiceData = {
      defaultPartner: companyReceiver,
      generalInfo: {
        invoiceDate: moment(invoiceDate).format("DD/MM/YYYY"),
        invoiceDetails: invoiceDescription,
        invoiceDueDate: moment(dueDate).format("DD/MM/YYYY"),
        invoiceNumber: input.number,
        invoiceTitle: emitterTitle
      },
      headerInfo: {
        ...headerInfo,
        contact: {
          ...companyEmitterContactDetails
        },
        documentType
      },
      invoiceId,
      legalNotices: displayLegalNotice,
      pricingInfo: {
        discount,
        totalAllWithVat: total,
        totalAllWithoutVat: totalWoT
      },
      products,
      receiverCompany
    };

    return invoiceData;
  };

  createOrUpdateInvoice = async (input: IUpdateInvoiceInput, id?: string) => {
    try {
      const { client } = this.props;
      if (id) {
        const { errors, data } = await client.mutate({
          mutation: createOrUpdateAR,
          variables: { id, input }
        });
        if (errors) {
          return null;
        }
        return data.createOrUpdateAR;
      } else {
        const { errors, data } = await client.mutate({
          mutation: createOrUpdateAR,
          variables: { input }
        });
        if (errors) {
          return null;
        }
        const { arCreatedById, id: invoiceId } = data.createOrUpdateAR;
        this.setState({
          arCreatedById,
          invoiceId
        });
        return data.createOrUpdateAR;
      }
    } catch (e) {}
  };

  getAutoSavedData = (): IInvoiceData => {
    return this.state;
  };

  render() {
    const updateInvoiceData = this.updateInvoiceData;
    const getAutoSavedData = this.getAutoSavedData;

    return this.state.isLoading ? (
      <Loading />
    ) : (
      <Provider value={{ updateInvoiceData, getAutoSavedData }}>
        {this.props.children}
      </Provider>
    );
  }
}

export default compose(withApollo)(AutoSaveProvider);
