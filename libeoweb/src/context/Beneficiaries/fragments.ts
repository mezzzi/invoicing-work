import gql from 'graphql-tag';

const sddB2bWhitelist = `
  uniqueMandateReference
  isRecurrent
  walletId
`;

const document = `
  documentId
  documentTag
  documentStatus
  documentTypeId
  documentType
  residenceId
  clientId
  userId
  userLastname
  userFirstname
  fileName
  temporaryUrl
  temporaryUrlThumb
  createdDate
  modifiedDate
`;

const documentFragment = gql`

fragment document on Document {
  ${document}
}`;

const beneficiary = `
  userId
  title
  firstname
  lastname
  nationality
  placeOfBirth
  userStatus
  birthCountry
  employeeType
  userTag
  birthday
  specifiedUSPerson
  incomeRange
  personalAssets
  occupation
  controllingPersonType
  phone
  address1
  address2
  postcode
  city
  country
  taxResidence
`;

const beneficiaryFragment = gql`
${documentFragment}

fragment beneficiary on Beneficiary {
  ${beneficiary}
}`;

const beneficiaryQuery = `
  ...beneficiary
  documents {
    total
    rows {
      ...document
    }
  }
`;

const representative = `
  firstname
  lastname
  fullnames
  birthday
  parentType
  userTypeId
`;

const representativeFragment = gql`
fragment representative on Representative {
  ${representative}
}`;

const representativeQuery = `
  ...representative
`;

export default {
  beneficiary: {
    fragment: beneficiaryFragment,
    query: beneficiaryQuery,
  },
  document: {
    fragment: documentFragment,
    query: document,
  },
  representative: {
    fragment: representativeFragment,
    query: representativeQuery,
  },
};
