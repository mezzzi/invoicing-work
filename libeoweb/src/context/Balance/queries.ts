import gql from 'graphql-tag';

import Balance from '../Balance/fragments';

export const balance: any = gql`
  ${Balance.fragment}

  query balance {
    balance {
      ${Balance.query}
    }
  }
`;

export const checkBalance: any = gql`
  query checkBalance($id: ID!, $paymentAt: Date) {
    checkBalance(invoiceId: $id, paymentAt: $paymentAt)
  }
`;
