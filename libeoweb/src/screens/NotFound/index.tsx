import { Layout } from 'antd';
import * as React from 'react';
import { RouteComponentProps } from 'react-router';

interface IProps extends RouteComponentProps {}

const NotFound: React.FunctionComponent<IProps> = ({ location }) => (
  <Layout style={{ flex: 1 }}>
    <Layout.Content
      style={{
        alignItems: 'center',
        background: '#fff',
        display: 'flex',
        justifyContent: 'center',
      }}
    >
      <p>
        La page <code>{location.pathname}</code> n'a pas été trouvée.
      </p>
    </Layout.Content>
  </Layout>
);

export default NotFound;
