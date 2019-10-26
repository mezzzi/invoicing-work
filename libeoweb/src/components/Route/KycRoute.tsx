import { EmptyLayout } from 'components/Layout';
import * as Auth from 'context/Auth';
import * as User from 'context/User';

import Skeleton from 'components/Skeleton';
import * as React from 'react';
import { compose } from 'react-apollo';
import {
  Redirect,
  Route,
  RouteComponentProps,
  RouteProps,
} from 'react-router-dom';

interface IProps extends RouteProps, Auth.InjectedProps, User.InjectedProps {
  component:
    | React.ComponentType<RouteComponentProps<any>>
    | React.ComponentType<any>;
}

function renderRoute(
  Component: React.ComponentClass,
  auth: Auth.InjectedInterface,
  user: User.InjectedInterface,
  props: RouteComponentProps,
) {
  const token = localStorage.getItem('token');
  if (token) {
    return (
      <EmptyLayout className="kyc-layout">
        <React.Suspense fallback={<Skeleton.Layout />}>
          <Component {...props} />
        </React.Suspense>
      </EmptyLayout>
    );
  }

  return (
    <Redirect to={{ pathname: '/login', state: { from: props.location } }} />
  );
}

const KycRoute: React.FunctionComponent<IProps> = ({
  component,
  auth,
  user,
  ...rest
}) => (
  <Route
    {...rest}
    render={renderRoute.bind(null, component as any, auth as any, user as any)}
  />
);

// export default React.memo(Auth.hoc()(User.hoc()(KycRoute)));
export default compose(
  React.memo,
  Auth.hoc(),
  User.hoc(),
)(KycRoute);
