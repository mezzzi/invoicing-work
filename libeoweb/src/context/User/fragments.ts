import gql from 'graphql-tag';

import Addresses from '../Addresses/fragments';
import Company from '../Company/fragments';
import Contacts from '../Contacts/fragments';
import Emails from '../Emails/fragments';

const user = `
  id
  firstname
  lastname
  email
  token
  lastLogin
  lastCguAccept
  createdAt
  updatedAt
`;

const userFragment = gql`
${Company.fragment}
${Addresses.fragment}
${Emails.fragment}
${Contacts.fragment}

fragment user on User {
  ${user}
}`;

const userQuery = `
  ...user
  companies {
    total
    rows {
      ${Company.query}
    }
  }
`;

const standalone = `
  ${user}
  companies {
    total
    rows {
      ${Company.standalone}
    }
  }
`;

export default {
  fragment: userFragment,
  query: userQuery,
  standalone,
};
