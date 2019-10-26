import gql from 'graphql-tag';

import fragments from './fragments';

export const createOrUpdateAddress: any = gql`
  ${fragments.fragment}

  mutation createOrUpdateAddress($input: AddressInput!) {
    createOrUpdateAddress(input: $input) {
      ${fragments.query}
    }
  }
`;
