import gql from 'graphql-tag';

import Addresses from '../Addresses/fragments';
import Contacts from '../Contacts/fragments';
import Emails from '../Emails/fragments';
import fragments from './fragments';

export const createOrUpdateCompany: any = gql`
  ${Addresses.fragment}
  ${Contacts.fragment}
  ${fragments.fragment}
  ${Emails.fragment}

  mutation createOrUpdateCompany($id: ID, $input: CompanyInput) {
    createOrUpdateCompany(id: $id, input: $input) {
      ${fragments.query}
    }
  }
`;

export const updateKycStatus: any = gql`
  ${Addresses.fragment}
  ${Contacts.fragment}
  ${fragments.fragment}
  ${Emails.fragment}

  mutation updateKycStatus($status: KycStatus) {
    updateKycStatus(status: $status) {
      ${fragments.query}
    }
  }
`;

export const updateKycStep: any = gql`
  ${Addresses.fragment}
  ${Contacts.fragment}
  ${fragments.fragment}
  ${Emails.fragment}

  mutation updateKycStep($step: String) {
    updateKycStep(step: $step) {
      kycStatus
      kycStep
      ${fragments.query}
    }
  }
`;

export const contract: any = gql`
  query contract {
    contract
  }
`;

export const signContract: any = gql`
  mutation signContract {
    signContract
  }
`;
