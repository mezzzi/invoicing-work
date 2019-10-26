import gql from 'graphql-tag';

const balance = `
  walletId
  currentBalance
  authorizations
  authorizedBalance
  currency
  calculationDate
`;

const balanceFragment = gql`

fragment balance on Balance {
  ${balance}
}`;

const balanceQuery = `
  ...balance
`;

export default {
  fragment: balanceFragment,
  query: balanceQuery,
};
