import gql from 'graphql-tag';

import fragments from './fragments';
import emailFragments from './fragments';

export const createContact: any = gql`
  ${fragments.fragment}
  ${emailFragments.fragment}

  mutation createContact($input: ContactInput) {
    createContact(input: $input) {
      ${fragments.query}
    }
  }
`;

export const updateContact: any = gql`
  ${fragments.fragment}
  ${emailFragments.fragment}

  mutation updateContact($id: ID!, $input: ContactInput!) {
    updateContact(id: $id, input: $input) {
      ${fragments.query}
    }
  }
`;
