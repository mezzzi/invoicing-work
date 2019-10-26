import { SignIn } from 'components/Auth';
import * as React from 'react';
import { RouteComponentProps } from 'react-router';

const Login: React.FunctionComponent<RouteComponentProps> = ({ match }) => (
  <SignIn hash={(match.params as any).hash} />
);

export default Login;
