import { Col, Form, Row } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import ApolloClient from 'apollo-client';
import gql from 'graphql-tag';
import { Moment } from 'moment';
import moment from 'moment';
import * as React from 'react';
import { compose, withApollo } from 'react-apollo';
import { isMobile } from 'react-device-detect';
import Dragula from 'react-dragula';
import { FormattedMessage } from 'react-intl';
import uuid from 'uuid/v4';

import { Icon } from 'components/Assets';
import { IconValue } from 'components/Assets/Icon';
import {
  ICompany,
  IGeneralInfo,
  IInvoiceData,
} from 'components/Invoicing/types';
import { createPartner, partners } from 'context/Partner/queries';
import * as AutoSave from 'screens/Invoicing/contexts/AutoSave';

import {
  DateBox,
  InputBox,
  SelectBox,
  TextAreaBox,
} from 'components/Invoicing';
import { H2, Span } from 'components/Typo';

import { ICompany as IPartner, IInputCompany } from 'context/Company/types';

import ControlPartner from 'screens/Invoice/ControlPartner';

interface IProps extends FormComponentProps, AutoSave.InjectedProps {
  client: ApolloClient<any>;
}

interface IState extends IGeneralInfo {
  partner?: IInputCompany;
  defaultPartner?: IPartner;
}

class DetailGeneralInfo extends React.PureComponent<IProps, IState> {
  private partnersList: ICompany[] = [{}];
  private partnersLoaded: boolean = false;

  constructor(props: IProps) {
    super(props);
    this.state = {
      invoiceDate: moment().format('DD/MM/YYYY'),
      invoiceDueDate: moment()
        .add(30, 'days')
        .format('DD/MM/YYYY'),
      invoiceNumber: uuid(),
    };
    this.restoreState();
  }

  componentDidMount() {
    this.populatePartnersInfo();
  }

  populatePartnersInfo = async () => {
    const { client } = this.props;
    const { data, errors } = await client.query({
      query: partners,
    });
    const {
      partners: { rows },
    } = data;
    this.partnersList = rows.map(
      ({
        id,
        name,
        siret,
        siren,
        vatNumber,
        addresses: { rows: addressRows },
      }: any) => {
        const address = addressRows[0] ? addressRows[0] : {};
        return {
          address1: address.address1,
          city: address.city,
          id,
          name,
          siren,
          siret,
          vatNumber,
          zipcode: address.zipcode,
        };
      },
    );
    this.partnersLoaded = true;
  };

  autoSave() {
    const { partner } = this.state;
    const state = { ...this.state };
    delete state.partner;
    const { idCreatedBy } = state;

    const { updateInvoiceData } = this.props;
    let receiverCompany;
    if (partner) {
      const { name, siret, siren, vatNumber, addresses = [{}] } = partner;
      receiverCompany = {
        ...addresses[0],
        name,
        siren,
        siret,
        vatNumber,
      };
    }
    updateInvoiceData &&
      updateInvoiceData({
        generalInfo: state,
        partner,
        receiverCompany,
      });
  }

  restoreState = () => {
    const { getAutoSavedData } = this.props;
    const result = getAutoSavedData && getAutoSavedData();
    if (result) {
      const { generalInfo, partner, defaultPartner } = result;
      if (generalInfo) {
        this.state = {
          ...this.state,
          ...generalInfo,
          defaultPartner,
          partner,
        };
      }
    }
  };

  componentDidUpdate() {
    this.autoSave();
  }

  onPartnerChanged = (partner?: any) => {
    if (partner) {
      this.setState({
        partner,
      });
      if (!this.partnersLoaded) {
        return;
      }
      const alreadyPartner = this.partnersList.find(
        ({ siren }) => siren === partner.siren,
      );
      if (alreadyPartner === undefined) {
        this.addToPartnersList(partner);
      }
    }
  };

  addToPartnersList = async (partner: any) => {
    const message = 'Partner Successfully Added';
    try {
      const { client } = this.props;
      const { errors, data } = await client.mutate({
        mutation: createPartner,
        variables: { input: partner as IInputCompany },
      });
      if (errors) {
        return null;
      } else {
        this.populatePartnersInfo();
        return data.createPartner;
      }
    } catch (e) {}
  };

  roundResult = (value: string): string => {
    return parseFloat(value).toFixed(2);
  };

  invoiceTitleChanged = (e: any, value: string) =>
    this.setState({
      invoiceTitle: value,
    });

  customerChanged = (id: any, value: any) => {
    this.setState({
      idCreatedBy: id,
    });
  };

  detailChanged = (e: any, value: string) =>
    this.setState({
      invoiceDetails: value,
    });

  dateChanged = (date: Moment, dateString: string) => {
    this.setState({
      invoiceDate: dateString,
    });
  };

  dueDateChanged = (date: Moment, dateString: string) => {
    this.setState({
      invoiceDueDate: dateString,
    });
  };

  render() {
    const { form } = this.props;

    const {
      invoiceNumber,
      idCreatedBy,
      invoiceDate,
      invoiceDueDate,
      invoiceTitle,
      invoiceDetails,
      defaultPartner,
    } = this.state;

    return (
      <>
        <Row className="preference">
          <Col xs={{ span: 24 }} sm={{ span: 14 }} md={{ span: 10 }}>
            <InputBox
              defaultValue={invoiceTitle}
              onChange={this.invoiceTitleChanged}
              title={
                <FormattedMessage
                  id={'invoicing.detail.body.invoice.input.invoiceTitle'}
                />
              }
              placeholder="Enter invoice object"
              form={form}
              id="text1"
            />
          </Col>
        </Row>
        <Row>
          <Col xs={{ span: 24 }} sm={{ span: 12 }} md={{ span: 12 }}>
            <div>
              <div className="invoicing-element-title">
                <span>
                  {
                    <FormattedMessage id="invoicing.detail.body.dropdown.invoiceTitle" />
                  }
                </span>
              </div>

              <ControlPartner
                onChangePartner={this.onPartnerChanged}
                defaultPartner={defaultPartner}
                form={form}
              />
            </div>
          </Col>
          <Col
            xs={{ span: 24 }}
            sm={{ span: 11, offset: 2 }}
            md={{ span: 7, offset: 2 }}
          >
            <InputBox
              title={
                <FormattedMessage
                  id={'invoicing.detail.body.invoice.invoiceNumber'}
                />
              }
              form={form}
              id="text2"
              disabled={true}
              defaultValue={invoiceNumber}
            />
          </Col>
        </Row>
        <Row type="flex">
          <Col xs={{ span: 24 }} md={{ span: 12 }} className="mt-1">
            <TextAreaBox
              id="textarea1"
              defaultValue={invoiceDetails}
              title={
                <FormattedMessage id="invoicing.detail.body.invoice.invoiceDetails" />
              }
              placeholder="Lora Ipsum blah blah"
              form={form}
              onChange={this.detailChanged}
            />
          </Col>
          <Col xs={{ span: 24 }} md={{ span: 7, offset: 2 }}>
            <div className="input-group">
              <DateBox
                defaultValue={moment(invoiceDate, 'DD/MM/YYYY')}
                id="date1"
                title={
                  <FormattedMessage
                    id={'invoicing.detail.body.invoice.invoiceDate'}
                  />
                }
                form={form}
                onChangeDate={this.dateChanged}
              />
              <DateBox
                id="date2"
                defaultValue={moment(invoiceDueDate, 'DD/MM/YYYY')}
                title={
                  <FormattedMessage id={'invoicing.detail.body.paymentdue'} />
                }
                form={form}
                onChangeDate={this.dueDateChanged}
              />
            </div>
          </Col>
        </Row>
      </>
    );
  }
}

export default compose(
  Form.create({}),
  withApollo,
  AutoSave.hoc(),
)(DetailGeneralInfo);
