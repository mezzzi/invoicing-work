import gql from 'graphql-tag';

import fragments from './fragments';

export const beneficiaries: any = gql`
  ${fragments.beneficiary.fragment}

  query beneficiaries {
    beneficiaries {
      total
      rows {
        ${fragments.beneficiary.query}
      }
    }
  }
`;

export const representatives: any = gql`
  ${fragments.representative.fragment}

  query representatives {
    representatives {
      total
      rows {
        ${fragments.representative.query}
      }
    }
  }
`;

export const createBeneficiary: any = gql`
  ${fragments.beneficiary.fragment}

  mutation createBeneficiary($input: BeneficiaryInput!) {
    createBeneficiary(input: $input) {
      ${fragments.beneficiary.query}
    }
  }
`;

export const removeBeneficiary: any = gql`
  ${fragments.beneficiary.fragment}

  mutation removeBeneficiary($id: Int!) {
    removeBeneficiary(id: $id) {
      ${fragments.beneficiary.query}
    }
  }
`;

export const removeDocument: any = gql`
  mutation removeDocument($id: Int!) {
    removeDocument(id: $id) {
      ${fragments.document.query}
    }
  }
`;
