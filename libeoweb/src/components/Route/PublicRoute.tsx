import { GuestLayout } from 'components/Layout';
import * as Auth from 'context/Auth';
import * as React from 'react';
import { Route, RouteComponentProps, RouteProps } from 'react-router-dom';

interface IProps extends RouteProps, Auth.InjectedProps {
  component:
    | React.ComponentType<RouteComponentProps<any>>
    | React.ComponentType<any>;
}

function renderRoute(
  Component: React.ComponentClass,
  auth: Auth.InjectedInterface,
  props: RouteComponentProps,
) {
  // const token = localStorage.getItem('token');
  // if (token) {
  //   return <Redirect to={{ pathname: '/', state: { from: props.location } }} />;
  // }
  return (
    <GuestLayout>
      <React.Suspense fallback={null}>
        <Component {...props} />
      </React.Suspense>
    </GuestLayout>
  );
}

const PublicRoute: React.FunctionComponent<IProps> = ({
  component,
  auth,
  ...rest
}) => (
  <Route
    {...rest}
    render={renderRoute.bind(null, component as any, auth as any)}
  />
);

export default React.memo(Auth.hoc()(PublicRoute));
