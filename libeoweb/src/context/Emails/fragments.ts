import gql from 'graphql-tag';

const email = `
  id
  email
  createdAt
  updatedAt
`;

const emailFragment = gql`
fragment email on Email {
  ${email}
}`;

export default {
  fragment: emailFragment,
  // query: emailQuery
};
