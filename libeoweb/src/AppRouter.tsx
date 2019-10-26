import {
  ExternalRoute,
  InvoicingRoute,
  KycRoute,
  PrivateRoute,
  PublicRoute,
} from 'components/Route';
import * as React from 'react';
import { isMobile } from 'react-device-detect';
import { Switch } from 'react-router-dom';
import ResetPassword from './screens/ResetPassword';
import ResetPasswordRequest from './screens/ResetPasswordRequest';

const Dashboard = React.lazy(() => import('screens/Dashboard'));
const Balance = React.lazy(() => import('screens/Profile/Balance'));
const PurchaseDraft = React.lazy(() => import('screens/Purchase/Draft'));
const PurchaseBills = React.lazy(() => import('screens/Purchase/Bills'));
const Invoice = React.lazy(() => import('screens/Invoice'));
const Network = React.lazy(() => import('screens/Network'));
const Partner = React.lazy(() => import('screens/Partner'));
const Login = React.lazy(() => import('screens/Login'));
const Camera = React.lazy(() => import('screens/Camera'));
const Signup = React.lazy(() => import('screens/Signup'));
const Invoicing = React.lazy(() => import('screens/Invoicing'));
const ProfileEdit = React.lazy(() => import('screens/Profile/Edit'));
const Infos = React.lazy(() => import('screens/Company/Infos'));
const AccountingOptions = React.lazy(() =>
  import('screens/Company/AccountingOptions'),
);
const AccountingExport = React.lazy(() =>
  import('screens/Company/AccountingExport'),
);
const Collaborators = React.lazy(() => import('screens/Company/Collaborators'));
const Bank = React.lazy(() => import('screens/Company/Bank/index'));
const SignUpConfirmEmail = React.lazy(() =>
  import('screens/SignupConfirmEmail'),
);
const SignUpSuccess = React.lazy(() => import('screens/SignupSuccess'));
const NotFound = React.lazy(() => import('screens/NotFound'));
const ResetPasswordEmailSent = React.lazy(() =>
  import('screens/ResetPasswordEmailSent'),
);

const Kyc = React.lazy(() => import('screens/Kyc'));

const AppRouter = () =>
  isMobile ? (
    <Switch>
      <PublicRoute path="/login/:hash?" component={Login} />
      <PrivateRoute
        path="/"
        component={Camera}
        layout={{
          sidebar: false,
        }}
      />
      <PublicRoute component={NotFound} />
    </Switch>
  ) : (
    <Switch>
      <PublicRoute path="/login/:hash?" component={Login} />
      <PublicRoute path="/signup" component={Signup} />
      <PublicRoute path="/signup-success" component={SignUpSuccess} />
      <PublicRoute
        path="/signup-confirm-email"
        component={SignUpConfirmEmail}
      />
      <PublicRoute
        path="/reset-password-request"
        component={ResetPasswordRequest}
      />
      <PublicRoute
        path="/reset-password-email-sent"
        component={ResetPasswordEmailSent}
      />
      <PublicRoute path="/reset-password/:hash" component={ResetPassword} />
      <PrivateRoute path="/" exact component={Dashboard} />
      <PrivateRoute path="/purchase/draft" component={PurchaseDraft} />
      <PrivateRoute path="/invoice/draft/:id" component={Invoice} />
      <PrivateRoute path="/purchase/bills" component={PurchaseBills} />
      <PrivateRoute path="/network" component={Network} />
      <PrivateRoute path="/partner/:id" component={Partner} />
      <PrivateRoute
        path="/balance"
        component={Balance}
        layout={{
          subSidebar: true,
        }}
      />
      <PrivateRoute
        path="/profile/informations"
        component={ProfileEdit}
        layout={{
          subSidebar: true,
        }}
      />
      <PrivateRoute
        path="/company/informations"
        exact
        component={Infos}
        layout={{
          subSidebar: true,
        }}
      />
      <PrivateRoute
        path="/company/accounting/options"
        component={AccountingOptions}
        layout={{
          subSidebar: true,
        }}
      />
      <PrivateRoute
        path="/company/accounting"
        component={AccountingExport}
        layout={{
          subSidebar: true,
        }}
      />
      <PrivateRoute
        path="/company/collaborators"
        component={Collaborators}
        layout={{
          subSidebar: true,
        }}
      />
      <KycRoute path="/company/bank" component={Bank} />
      <KycRoute path="/kyc/:step?/:view?" component={Kyc} />
      <InvoicingRoute path="/invoicing" component={Invoicing} />
      <ExternalRoute path="/external/invoicing" component={Invoicing} />
      <PrivateRoute path="/sell/draft" component={Invoicing} />
      <PublicRoute component={NotFound} />
    </Switch>
  );

export default AppRouter;
