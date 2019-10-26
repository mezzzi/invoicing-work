import * as React from 'react';
import { Route, RouteComponentProps, RouteProps } from 'react-router-dom';

interface IProps extends RouteProps {
  component:
    | React.ComponentType<RouteComponentProps<any>>
    | React.ComponentType<any>;
}

function renderRoute(
  Component: React.ComponentClass,
  props: RouteComponentProps,
) {
  return (
    <React.Suspense fallback={null}>
      <Component {...props} />
    </React.Suspense>
  );
}

const ExternalRoute: React.FunctionComponent<IProps> = ({
  component,
  ...rest
}) => <Route {...rest} render={renderRoute.bind(null, component as any)} />;

export default React.memo(ExternalRoute);
