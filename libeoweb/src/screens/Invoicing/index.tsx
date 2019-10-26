import { Layout } from 'antd';
import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import Invoicing from 'screens/Invoicing/Invoicing';
import me from 'screens/Invoicing/static/me.json';
import partners from 'screens/Invoicing/static/partners.json';
interface IProps extends RouteComponentProps {}
import * as AutoSave from 'screens/Invoicing/contexts/AutoSave';

class InvoicingScreen extends React.PureComponent<IProps, {}> {
  render() {
    return (
      <Layout>
        <Layout.Content>
          <AutoSave.Provider>
            <Invoicing />
          </AutoSave.Provider>
        </Layout.Content>
      </Layout>
    );
  }
}

export default InvoicingScreen;
