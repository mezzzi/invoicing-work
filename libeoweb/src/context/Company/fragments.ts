import gql from 'graphql-tag';

const company = `
  id
  siren
  siret
  name
  brandName
  templatePreference
  logoUrl
  naf
  nafNorm
  numberEmployees
  legalForm
  category
  vatNumber
  capital
  phone
  slogan
  domainName
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
`;

const companyInput = `
  ${company}
  addresses {
    total
    rows {
      ...address
    }
  }
  contacts {
    total
    rows {
      ...contact
      emails {
        total
        rows {
          ...email
        }
      }
    }
  }
`;

const companyFragment = gql`

fragment company on Company {
  ${company}
}`;

const companyQuery = `
  ...company
  addresses {
    total
    rows {
      ...address
    }
  }
  contacts {
    total
    rows {
      ...contact
      emails {
        total
        rows {
          ...email
        }
      }
    }
  }
`;

export default {
  fragment: companyFragment,
  input: companyInput,
  query: companyQuery,
  standalone: company,
};
