import gql from 'graphql-tag';

import fragments from './fragments';

export const createOrUpdateAccountingPreferences: any = gql`
  ${fragments.accounting.fragment}

  mutation createOrUpdateAccountingPreferences($input: [AccountingPreferenceInput!]!) {
    createOrUpdateAccountingPreferences(input: $input) {
      total
      rows {
        ${fragments.accounting.query}
      }
    }
  }
`;

export const accountingPreferences: any = gql`
  ${fragments.accounting.fragment}

  query accountingPreferences($types: [AccountingPreferenceType], $default: Boolean) {
    accountingPreferences(types: $types, default: $default) {
      total
      rows {
        ${fragments.accounting.query}
      }
    }
  }
`;

export const accountingExports: any = gql`
  ${fragments.accountingExport.fragment}

  query exports($limit: Int, $offset: Int) {
    exports(limit: $limit, offset: $offset) {
      total
      rows {
        ${fragments.accountingExport.query}
      }
    }
  }
`;

export const accountingExport: any = gql`
  mutation {
    export
  }
`;
