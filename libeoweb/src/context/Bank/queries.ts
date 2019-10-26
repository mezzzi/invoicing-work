import gql from 'graphql-tag';

import fragments from './fragments';

export const bankAccounts: any = gql`
  ${fragments.bank.fragment}

  query bankAccounts {
    bankAccounts {
      total
      rows {
        ${fragments.bank.query}
      }
    }
  }
`;

export const createOrUpdateBankAccount: any = gql`
  ${fragments.bank.fragment}

  mutation createOrUpdateBankAccount($input: BankAccountInput!, $id: ID) {
    createOrUpdateBankAccount(input: $input, id: $id) {
      ${fragments.bank.query}
    }
  }
`;

export const bankAccount: any = gql`
  ${fragments.bank.fragment}

  query bankAccount($id: ID!) {
    bankAccount(id: $id) {
      ${fragments.bank.query}
    }
  }
`;

export const changeDefaultBankAccount: any = gql`
  ${fragments.bank.fragment}

  mutation changeDefaultBankAccount($id: ID!) {
    changeDefaultBankAccount(id: $id) {
      ${fragments.bank.query}
    }
  }
`;

export const removeBankAccount: any = gql`
  ${fragments.bank.fragment}

  mutation removeBankAccount($id: ID!) {
    removeBankAccount(id: $id) {
      ${fragments.bank.query}
    }
  }
`;

export const createMandate: any = gql`
  ${fragments.mandate.fragment}

  mutation createMandate($bankAccountId: ID!) {
    createMandate(bankAccountId: $bankAccountId) {
      ${fragments.mandate.query}
    }
  }
`;

export const mandate: any = gql`
  ${fragments.mandate.fragment}

  query mandate($id: ID!) {
    mandate(id: $id) {
      ${fragments.mandate.query}
    }
  }
`;

export const generateCodeMandate: any = gql`
  ${fragments.mandate.fragment}

  mutation generateCodeMandate($id: ID!) {
    generateCodeMandate(id: $id) {
      ${fragments.mandate.query}
    }
  }
`;

export const signedMandate: any = gql`
  ${fragments.mandate.fragment}

  mutation signedMandate($id: ID!, $code: String!) {
    signedMandate(id: $id, code: $code) {
      ${fragments.mandate.query}
    }
  }
`;

export const removeMandate: any = gql`
  ${fragments.mandate.fragment}

  mutation removeMandate($id: ID!) {
    removeMandate(id: $id) {
      ${fragments.mandate.query}
    }
  }
`;
