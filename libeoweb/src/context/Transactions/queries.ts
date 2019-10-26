import gql from 'graphql-tag';

import Transaction from '../Transaction/fragments';

export const transactions: any = gql`
  ${Transaction.fragment}

  query transactions($limit: Int, $page: Int) {
    transactions(limit: $limit, page: $page) {
      total
      rows {
        ${Transaction.query}
      }
    }
  }
`;
