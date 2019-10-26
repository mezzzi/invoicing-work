import gql from 'graphql-tag';

import Emails from '../Emails/fragments';

const contact = `
  id
  firstname
  lastname
  createdAt
  updatedAt
`;

const contactQuery = `
  ...contact
  emails {
    total
    rows {
      ...email
    }
  }
`;

const contactFragment = gql`
${Emails.fragment}

fragment contact on Contact {
  ${contact}
}`;

export default {
  fragment: contactFragment,
  query: contactQuery,
};
