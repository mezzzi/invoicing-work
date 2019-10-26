import gql from 'graphql-tag';

import Addresses from '../Addresses/fragments';
import Company from '../Company/fragments';
import Contacts from '../Contacts/fragments';
import Emails from '../Emails/fragments';
import fragments from './fragments';

export const getMe = gql`
  ${Company.fragment}
  ${Addresses.fragment}
  ${Emails.fragment}
  ${Contacts.fragment}

  query me {
    me {
      ${fragments.standalone}
      currentCompany {
        kycStatus
        kycStep
        provisionningStrategy
        ${Company.query}
      }
    }
  }
`;

export const updateUser = gql`

  mutation updateUser($input: UserInput!) {
    updateUser(input: $input) {
      ${fragments.standalone}
    }
  }
`;
