import gql from 'graphql-tag';

const iban = `
  id
  iban
  result
  returnCode
  bic
  country
  bankCode
  bank
  bankAddress
  branch
  branchCode
  inSclDirectory
  sct
  sdd
  cor1
  treezorBeneficiaryId
  b2b
  scc
  jsonIbanBic
  createdAt
`;

const ibanFragment = gql`
fragment iban on Iban {
  ${iban}
}`;

const ibanQuery: string = `
  ...iban
  readerCompany {
    id
    siren
    siret
    name
    brandName
    naf
    nafNorm
    numberEmployees
    legalForm
    category
    vatNumber
    capital
    phone
    incorporationAt
    source
    treezorEmail
    treezorUserId
    treezorWalletId
    treezorIban
    treezorBic
    createdAt
    updatedAt
    status
  }
`;

export default {
  fragment: ibanFragment,
  query: ibanQuery,
};
