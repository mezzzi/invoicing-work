import gql from 'graphql-tag';

import Invoice from 'context/Invoice/fragments';

export const createInvoice: any = gql`
  ${Invoice.fragment}
  mutation createInvoice($input: InvoiceInput!) {
    createInvoice(input: $input) {
      ${Invoice.query}
    }
  }
`;
