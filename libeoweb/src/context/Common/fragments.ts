import gql from 'graphql-tag';
import User from '../User/fragments';

const history = `
  id
  event
  params
  createdAt
  updatedAt
`;

const historyFragment = gql`
${User.fragment}

fragment history on History {
  ${history}
}`;

const historyQuery = `
  ...history
  user {
    ${User.query}
  }
`;

export default {
  history: {
    fragment: historyFragment,
    query: historyQuery,
  },
};
