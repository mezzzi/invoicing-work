import * as React from 'react';
import { FormattedMessage } from 'react-intl';

import ApolloClient from 'apollo-client';
import gql from 'graphql-tag';
import { compose, withApollo } from 'react-apollo';

import { createOrUpdateCompany } from 'context/Company/queries';
import { IInputCompany } from 'context/Company/types.d';

import { Button } from 'components/Button';
import { Content } from 'components/Layout';

import * as AutoSave from 'screens/Invoicing/contexts/AutoSave';

import InvoiceDetail from 'screens/Invoicing/Detail';
import 'screens/Invoicing/Invoicing.module.less';
import CreateInvoiceWithNewTemplate from 'screens/Invoicing/New';

interface IProps extends AutoSave.InjectedProps {
  client: ApolloClient<any>;
}

interface IState {
  userHasTemplate: boolean;
}

class Invoicing extends React.PureComponent<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    const { getAutoSavedData } = this.props;
    const { templateId } = getAutoSavedData();
    this.state = {
      userHasTemplate: this.isValidTemplateId(templateId),
    };
  }

  isValidTemplateId = (templateId: any) => {
    if (!templateId) {
      return false;
    }
    return ['1', '2', '3'].indexOf(templateId) !== -1;
  };

  onGoToDetail = () => {
    const { getAutoSavedData } = this.props;
    const { templateId } = getAutoSavedData();
    const fixedUrl =
      'https://www.libeo.io/wp-content/uploads/2019/02/cropped-Plan-de-travail-1-copy-3.png';
    this.updateCompanyDetail({
      logoUrl: fixedUrl,
      templatePreference: Number(templateId),
    });
    this.setState({
      userHasTemplate: true,
    });
  };

  updateCompanyDetail = async (detail: IInputCompany) => {
    const { client, getAutoSavedData } = this.props;
    const { currentCompany } = getAutoSavedData();
    if (currentCompany && currentCompany.id) {
      const { data, errors } = await client.mutate({
        mutation: createOrUpdateCompany,
        variables: { id: currentCompany.id, input: { ...detail } },
      });
    }
  };

  render() {
    const { userHasTemplate } = this.state;
    return (
      <div className="invoicing">
        {userHasTemplate ? (
          <InvoiceDetail />
        ) : (
          <CreateInvoiceWithNewTemplate onGoToDetail={this.onGoToDetail} />
        )}
      </div>
    );
  }
}

export default compose(
  AutoSave.hoc(),
  withApollo,
)(Invoicing);
