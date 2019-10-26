import gql from 'graphql-tag';

import fragments from '../User/fragments';

export const signup = gql`
  ${fragments.fragment}

  mutation signup($input: SignUpInput!) {
    signup(input: $input) {
      ${fragments.query}
    }
  }
`;

export const signin = gql`
  ${fragments.fragment}

  mutation signin($input: SignInInput!) {
    signin(input: $input) {
      ${fragments.query}
    }
  }
`;

export const signout = gql`
  mutation {
    logout
  }
`;

export const activateUser = gql`
  mutation activateUser($confirmationToken: String!) {
    activateUser(confirmationToken: $confirmationToken)
  }
`;

export const refreshConfirmationTokenUser = gql`
  mutation refreshConfirmationTokenUser($email: String!) {
    refreshConfirmationTokenUser(email: $email) {
      email
    }
  }
`;

export const resetPasswordRequest = gql`
  mutation sendResetPasswordEmail($input: SendResetPasswordEmailInput!) {
    sendPasswordResetEmail(input: $input) {
      status
    }
  }
`;

export const resetPassword = gql`
  mutation resetPassword($input: PasswordResetInput!) {
    resetPassword(input: $input)
  }
`;
