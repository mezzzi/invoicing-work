import * as Auth from 'context/Auth';
import * as Upload from 'context/Upload';
import * as User from 'context/User';

import { ConnectedLayout } from 'components/Layout';
import { IConnectedLayoutOptions } from 'components/Layout/ConnectedLayout';
import Skeleton from 'components/Skeleton';
import * as React from 'react';
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
  layout?: IConnectedLayoutOptions;
}

function renderRoute(
  Component: React.ComponentClass,
  auth: Auth.InjectedInterface,
  user: User.InjectedInterface,
  layout: IConnectedLayoutOptions | undefined,
  props: RouteComponentProps,
) {
  const token = localStorage.getItem('token');
  if (token) {
    return (
      <ConnectedLayout {...layout || {}}>
        <Upload.Provider>
          <React.Suspense fallback={<Skeleton.Layout {...layout} />}>
            <Component {...props} />
          </React.Suspense>
        </Upload.Provider>
      </ConnectedLayout>
    );
  }

  return (
    <Redirect to={{ pathname: '/login', state: { from: props.location } }} />
  );
}

const PrivateRoute: React.FunctionComponent<IProps> = ({
  component,
  auth,
  user,
  layout,
  ...rest
}) => {
  return (
    <Route
      {...rest}
      render={renderRoute.bind(
        null,
        component as any,
        auth as any,
        user as any,
        layout,
      )}
    />
  );
};

export default React.memo(Auth.hoc()(User.hoc()(PrivateRoute)));
