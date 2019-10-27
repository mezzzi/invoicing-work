import { Col, Icon, message, Row, Upload } from "antd";
import { Form } from "antd";
import { FormComponentProps } from "antd/lib/form";
import ApolloClient from "apollo-client";
import * as React from "react";
import { compose, withApollo } from "react-apollo";
import { isMobile } from "react-device-detect";
import { FormattedMessage } from "react-intl";

import { createOrUpdateCompany } from "context/Company/queries";

import { Icon as MyIcon } from "components/Assets";
import { IconValue } from "components/Assets/Icon";
import { Button } from "components/Button";
import { DynamicSelectBox, SelectBox } from "components/Invoicing";

import { CollapseCard } from "components/Invoicing/Card";

import { ICompany, IContact, IHeaderInfo } from "components/Invoicing/types";
import { IContact as IDetailedContact } from "context/Contacts/types.d";
import * as AutoSave from "screens/Invoicing/contexts/AutoSave";

import { UploadFile } from "antd/lib/upload/interface";

import LocalUpload from "components/Form/LocalUpload";

interface IProps extends FormComponentProps, AutoSave.InjectedProps {
  client: ApolloClient<any>;
}

interface IState extends IHeaderInfo {}

class HeaderCard extends React.PureComponent<IProps, IState> {
  private emitterContacts: IContact[] | undefined = undefined;

  constructor(props: IProps) {
    super(props);
    this.state = {};
    this.restoreState();
  }

  componentDidUpdate() {
    this.autoSave();
  }

  autoSave() {
    const { updateInvoiceData } = this.props;
    updateInvoiceData({
      headerInfo: { ...this.state }
    });
  }

  onChangeLogoUrl = (file: UploadFile, base64: string) => {
    this.autoSaveLogoUrl(base64);
  };

  onRemoveLogoUrl = (uuid: string) => {
    this.autoSaveLogoUrl("");
  };

  autoSaveLogoUrl = async (logoUrl: string) => {
    const { logoUrl: alreadySavedUrl } = this.state;
    if (alreadySavedUrl === logoUrl) {
      return;
    }
    const { updateInvoiceData, getAutoSavedData } = this.props;
    const fixedUrl =
      "https://www.libeo.io/wp-content/uploads/2019/02/cropped-Plan-de-travail-1-copy-3.png";
    const { client } = this.props;
    const { emitterCompany: { id } = { id: "fakeId" } } = getAutoSavedData();
    this.setState({
      logoUrl
    });
    const { data, errors } = await client.mutate({
      mutation: createOrUpdateCompany,
      variables: { id, input: { logoUrl: fixedUrl } }
    });
  };

  getAutoSavedUrl = () => {
    const { getAutoSavedData } = this.props;
    const {
      headerInfo: { logoUrl } = { logoUrl: undefined }
    } = getAutoSavedData();
    return logoUrl;
  };

  restoreState = () => {
    const { getAutoSavedData } = this.props;
    const { headerInfo, currentCompany } = getAutoSavedData();
    this.emitterContacts =
      currentCompany &&
      currentCompany.contacts &&
      currentCompany.contacts.rows.map(
        ({ id, firstname, lastname, emails }: IDetailedContact) => ({
          email: emails ? emails.rows[0].email : "",
          firstname,
          id,
          lastname
        })
      );
    if (headerInfo) {
      this.state = {
        ...headerInfo
      };
    }
  };

  contactChanged = (value: any, option: any) => {
    if (this.emitterContacts) {
      const contact = this.emitterContacts.find(({ id }: any) => id === value);
      this.setState({
        contact
      });
    }
  };

  documentTypeChanged = (value: any, option: any) =>
    this.setState({
      documentType: value
    });

  render() {
    const { getAutoSavedData, form } = this.props;
    const {
      emitterCompany: { name, siret, vatNumber, address1, address2 } = {
        address1: "",
        address2: "",
        name: "",
        siret: "",
        vatNumber: ""
      },
      currentCompany
    } = getAutoSavedData();

    const { documentType, contact, logoUrl } = this.state;

    return (
      <div>
        <CollapseCard
          shadow
          title={<FormattedMessage id="invoicing.detail.header.title" />}
          className={"invoicing-header"}
          titleAlign={"left"}
          collapsable
        >
          <Row>
            <Col
              xs={{ span: 24 }}
              sm={{ span: 8 }}
              md={{ span: 5 }}
              className="mob-mb15"
            >
              <div
                className={`upload-second-logo square ${
                  isMobile ? "bottom-space" : ""
                }`}
              >
                <div
                  style={{
                    height: "100%",
                    maxHeight: "180px",
                    objectFit: "contain",
                    width: "100%"
                  }}
                >
                  <LocalUpload
                    title="Upload Logo"
                    onChange={this.onChangeLogoUrl}
                    onRemove={this.onRemoveLogoUrl}
                    defaultPreview={this.getAutoSavedUrl()}
                  />
                </div>
              </div>
            </Col>
            <Col
              xs={{ span: 24 }}
              sm={{ span: 14, offset: 2 }}
              md={{ span: 8, offset: 1 }}
              className="mob-mb15"
            >
              <div>
                <div
                  className={`upload-second-logo normal ${
                    isMobile ? "bottom-space" : ""
                  }`}
                >
                  <span>{name}</span>
                  <p>{address1}</p>
                  {address2 && <p>{address2}</p>}
                  <p>SIRET : {siret}</p>
                  <p>VAT : {vatNumber}</p>
                </div>
                <div className="company-info">
                  <MyIcon value={IconValue.Edit} />
                  <a>
                    <FormattedMessage id="invoicing.detail.header.edit.companyinfo" />
                  </a>
                </div>
              </div>
            </Col>
            <Col
              xs={{ span: 24 }}
              sm={{ span: 24 }}
              md={{ span: 9, offset: 1 }}
              className="selection-group"
            >
              {this.emitterContacts && (
                <DynamicSelectBox
                  defaultValue={contact && contact.email}
                  id="select1"
                  onChangeSelect={this.contactChanged}
                  displayKey={"email"}
                  title={
                    <FormattedMessage id="invoicing.detail.header.dropdown1.title" />
                  }
                  placeholder="Lucas de Vries"
                  options={this.emitterContacts}
                  form={form}
                />
              )}

              <SelectBox
                defaultValue={documentType}
                id="select2"
                onChangeSelect={this.documentTypeChanged}
                title={
                  <FormattedMessage id="invoicing.detail.header.dropdown2.title" />
                }
                placeholder="Select the documentType type"
                options={["Invoice", "Quote"]}
                form={form}
              />
            </Col>
          </Row>
        </CollapseCard>
      </div>
    );
  }
}

export default compose(
  Form.create({}),
  AutoSave.hoc(),
  withApollo
)(HeaderCard);
