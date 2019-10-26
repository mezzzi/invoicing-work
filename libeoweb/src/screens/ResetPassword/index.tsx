import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import { ResetPasswordForm } from '../../components/Auth/ResetPassword';

const ResetPassword: React.FunctionComponent<RouteComponentProps> = ({
  match,
}) => <ResetPasswordForm hash={(match.params as any).hash} />;

export default ResetPassword;
