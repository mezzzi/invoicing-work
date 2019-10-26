import gql from 'graphql-tag';

import Companies from '../Company/fragments';
import Iban from '../Iban/fragments';
import User from '../User/fragments';

const bankAccount = `
  id
  label
  default
  enabled
`;

const mandate = `
  id
  treezorMandateId
  filePath
  status
  rum
  signatoryIp
  signaturedAt
  createdAt
  updatedAt
`;

const bankAccountFragment = gql`
${Iban.fragment}
${User.fragment}

fragment bankAccount on BankAccount {
  ${bankAccount}
}`;

const bankAccountQuery = `
  ...bankAccount
  company {
    ${Companies.standalone}
  }
  iban {
    ${Iban.query}
  }
  mandates {
    ${mandate}
    signatory {
      ${User.query}
    }
  }
`;

const mandateFragment = gql`
${User.fragment}

fragment mandate on Mandate {
  ${mandate}
}`;

const mandateQuery = `
  ...mandate
  signatory {
    ${User.query}
  }
`;

export default {
  bank: {
    fragment: bankAccountFragment,
    query: bankAccountQuery,
  },
  mandate: {
    fragment: mandateFragment,
    query: mandateQuery,
  },
};
