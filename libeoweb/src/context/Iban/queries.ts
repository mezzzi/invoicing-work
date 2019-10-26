import gql from 'graphql-tag';

import fragments from './fragments';

export const checkIban: any = gql`
  query checkIban($iban: String!) {
    checkIban(iban: $iban) {
      iban
      bic
      status
      name
    }
  }
`;

export const ibans: any = gql`
  ${fragments.fragment}

  query ibans($siren: String!) {
    ibans(siren: $siren) {
      total
      rows {
        ${fragments.query}
      }
    }
  }
`;
