import gql from 'graphql-tag';

import Addresses from '../Addresses/fragments';
import common from '../Common/fragments';
import Companies from '../Company/fragments';
import Contacts from '../Contacts/fragments';
import Emails from '../Emails/fragments';
import Iban from '../Iban/fragments';
import User from '../User/fragments';

const invoice = `
  id
  status
  filename
  filepath
  importAt
  number
  currency
  total
  totalWoT
  dueDate
  invoiceDate
  receiverTitle
  emitterTitle
  enabled
  estimatedBalance
  paymentAt
  error
  ocrStatus
  ocrPartner
  ocrSirenFeedback
  ocrFeedback
  purchaseAccount {
    id
    key
    value
    description
    type
    order
    enabled
    createdAt
    updatedAt
  }
  createdAt
  updatedAt

  companyEmitterId
  companyEmitterDetails
  companyEmitterContactDetails
  companyReceiverId
  companyReceiverDetails

  documentType
  invoiceDescription
  discount
  templateId
  displayLegalNotice
  vatAmounts
  products
  arCreatedById
  source
`;
// ocrFeedback NOT USED AT THIS TIME

const invoiceFragment = gql`
${Iban.fragment}
${Companies.fragment}
${Addresses.fragment}
${Emails.fragment}
${Contacts.fragment}
${User.fragment}
${common.history.fragment}

fragment invoice on Invoice {
  ${invoice}
}`;

const invoiceQuery = `
  ...invoice
  importedBy {
    ${User.query}
  }
  createdBy {
    ${User.query}
  }
  companyEmitter {
    ${Companies.query}
  }
  companyReceiver {
    ${Companies.query}
  }
  iban {
    ${Iban.query}
  }
  history {
    total
    rows {
      ${common.history.query}
    }
  }
`;

const standalone = `
  ${invoice}
  companyEmitter {
    ${Companies.standalone}
  }
  companyReceiver {
    ${Companies.standalone}
  }
`;

export default {
  fragment: invoiceFragment,
  query: invoiceQuery,
  standalone,
};
