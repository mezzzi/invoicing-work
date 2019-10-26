import gql from 'graphql-tag';

import Invoice from '../Invoice/fragments';

export const invoices: any = gql`
  query invoices($filters: InvoiceFilters, $limit: Int, $offset: Int) {
    invoices(filters: $filters, limit: $limit, offset: $offset) {
      total
      rows {
        ${Invoice.standalone}
      }
    }
  }
`;

export const emittedInvoices: any = gql`
  query emittedInvoices($filters: InvoiceFilters, $limit: Int, $offset: Int) {
    emittedInvoices(filters: $filters, limit: $limit, offset: $offset) {
      total
      rows {
        ${Invoice.standalone}
      }
    }
  }
`;

export const count: any = gql`
  query invoices($filters: InvoiceFilters, $limit: Int, $offset: Int) {
    invoices(filters: $filters, limit: $limit, offset: $offset) {
      total
    }
  }
`;
