import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import { ResetPasswordRequestForm } from '../../components/Auth/ResetPassword';

const ResetPasswordRequest: React.FunctionComponent<
  RouteComponentProps
> = () => <ResetPasswordRequestForm />;

export default ResetPasswordRequest;
