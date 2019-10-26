import gql from 'graphql-tag';

import Addresses from '../Addresses/fragments';
import Company from '../Company/fragments';
import Contacts from '../Contacts/fragments';
import Emails from '../Emails/fragments';

export const searchCompanies: any = gql`
  ${Addresses.fragment}
  ${Emails.fragment}
  ${Contacts.fragment}
  ${Company.fragment}

  query searchCompanies($query: String!, $limit: Int, $offset: Int) {
    searchCompanies(query: $query, limit: $limit, offset: $offset) {
      total
      rows {
        ${Company.query}
      }
    }
  }
`;

export const companyWithComplementaryInfos: any = gql`
  ${Addresses.fragment}

  query companyWithComplementaryInfos($siren: String!) {
    companyWithComplementaryInfos(siren: $siren) {
      capital
      legalAnnualTurnOver
      numberEmployees
      legalNetIncomeRange
      phone
      addresses {
        total
        rows {
          ${Addresses.query}
        }
      }
    }
  }
`;
