import gql from 'graphql-tag';

import Addresses from '../Addresses/fragments';
import Company from '../Company/fragments';
import Contacts from '../Contacts/fragments';
import Emails from '../Emails/fragments';

export const createPartner: any = gql`
  ${Addresses.fragment}
  ${Contacts.fragment}
  ${Company.fragment}
  ${Emails.fragment}

  mutation createPartner($input: CompanyInput!) {
    createPartner(input: $input) {
      ${Company.query}
    }
  }
`;

export const partners: any = gql`
  ${Addresses.fragment}
  ${Contacts.fragment}
  ${Company.fragment}
  ${Emails.fragment}

  query partners($orderBy: PartnerOrder, $limit: Int, $offset: Int) {
    partners(orderBy: $orderBy, limit: $limit, offset: $offset) {
      total
      rows {
        ${Company.query}
        invoicesSent
        invoicesReceived
      }
    }
  }
`;

export const partner: any = gql`
  ${Addresses.fragment}
  ${Contacts.fragment}
  ${Company.fragment}
  ${Emails.fragment}

  query partner($id: ID) {
    partner(id: $id) {
      ${Company.query}
      invoicesSent
      invoicesReceived
    }
  }
`;
