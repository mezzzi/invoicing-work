import gql from 'graphql-tag';

import fragments from './fragments';

export const invoice: any = gql`
  ${fragments.fragment}

  query invoice($id: ID!) {
    invoice(id: $id) {
      ${fragments.query}
    }
  }
`;

export const emittedInvoice: any = gql`
  ${fragments.fragment}

  query emittedInvoice($id: ID!) {
    emittedInvoice(id: $id) {
      ${fragments.query}
    }
  }
`;

export const updateInvoice: any = gql`
  ${fragments.fragment}

  mutation updateInvoice($id: ID!, $input: UpdateInvoiceInput!) {
    updateInvoice(id: $id, input: $input) {
      ${fragments.query}
    }
  }
`;

export const createOrUpdateAR: any = gql`
  ${fragments.fragment}

  mutation createOrUpdateAR($input: UpdateInvoiceInput!, $id: ID) {
    createOrUpdateAR(input: $input, id: $id) {
      ${fragments.query}
    }
  }
`;

export const updateInvoiceStatus: any = gql`
  ${fragments.fragment}

  mutation updateInvoiceStatus($id: ID!, $status: InvoiceStatus!) {
    updateInvoiceStatus(id: $id, status: $status) {
      ${fragments.query}
    }
  }
`;

export const removeInvoice: any = gql`
  mutation removeInvoice($id: ID!) {
    removeInvoice(id: $id) {
      id
    }
  }
`;

export const generateCode: any = gql`
  mutation generateCode($invoiceId: ID!) {
    generateCode(invoiceId: $invoiceId) {
      id
    }
  }
`;

export const payout: any = gql`
  ${fragments.fragment}

  mutation payout($invoiceId: ID!, $date: String, $code: String) {
    payout(invoiceId: $invoiceId, date: $date, code: $code) {
      ${fragments.query}
    }
  }
`;

export const payoutContacts: any = gql`
  mutation payoutContacts($invoiceId: ID!, $contactIds: [ID]) {
    payoutContacts(invoiceId: $invoiceId, contactIds: $contactIds)
  }
`;
