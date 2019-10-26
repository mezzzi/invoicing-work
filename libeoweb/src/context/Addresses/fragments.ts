import gql from 'graphql-tag';

const address = `
  id
  address1
  address2
  siret
  zipcode
  city
  country
`;

const addressFragment = gql`
fragment address on Address {
  ${address}
}`;

const addressQuery = `
  ...address
`;

export default {
  fragment: addressFragment,
  query: addressQuery,
};
