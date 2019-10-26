import gql from 'graphql-tag';

const transaction = `
  transactionId
  walletDebitId
  walletCreditId
  transactionType
  foreignId
  name
  description
  valueDate
  executionDate
  amount
  walletDebitBalance
  walletCreditBalance
  currency
  createdDate
`;

const transactionFragment = gql`

fragment transaction on Transaction {
  ${transaction}
}`;

const transactionQuery = `
  ...transaction
`;

export default {
  fragment: transactionFragment,
  query: transactionQuery,
};
