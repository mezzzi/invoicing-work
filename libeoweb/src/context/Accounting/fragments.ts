import gql from 'graphql-tag';

import Company from '../Company/fragments';

const accountingExport = `
  id
  fileLink
  enabled
  createdAt
  updatedAt
`;

const accountingExportFragment = gql`
fragment export on Export {
  ${accountingExport}
}`;

const accountingExportQuery = `
  ...export
  company {
    ${Company.standalone}
  }
`;

const accounting = `
  id
  key
  value
  description
  type
  order
  enabled
  createdAt
  updatedAt
  company {
    id
  }
`;

const accountingFragment = gql`
fragment accountingPreference on AccountingPreference {
  ${accounting}
}`;

const accountingQuery = `
  ...accountingPreference
`;

export default {
  accounting: {
    fragment: accountingFragment,
    query: accountingQuery,
  },
  accountingExport: {
    fragment: accountingExportFragment,
    query: accountingExportQuery,
  },
};
