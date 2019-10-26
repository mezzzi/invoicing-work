import { Col, Icon, Row } from 'antd';
import { Form } from 'antd';
import { CheckboxChangeEvent } from 'antd/lib/checkbox';
import { FormComponentProps } from 'antd/lib/form';
import { CheckBox } from 'components/Invoicing';
import { CollapseCard } from 'components/Invoicing/Card';
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import 'screens/Invoicing/Invoicing.module.less';

import * as AutoSave from 'screens/Invoicing/contexts/AutoSave';

interface IProps extends FormComponentProps, AutoSave.InjectedProps {}

import { ILegalNotices } from 'components/Invoicing/types';

interface IState extends ILegalNotices {}

class FooterCard extends React.PureComponent<
  IProps & AutoSave.InjectedProps,
  IState
> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      displayRIB: false,
      earlyPaymentCondition: false,
      latePaymentPenality: false,
      recoveryPenality: false,
      vatExemption: false,
    };
    this.restoreState();
  }

  restoreState = () => {
    const { getAutoSavedData } = this.props;
    const result = getAutoSavedData();
    const { legalNotices } = getAutoSavedData();
    if (legalNotices) {
      this.state = {
        ...legalNotices,
      };
    }
  };

  autoSaveLegalNotices = () => {
    const { updateInvoiceData } = this.props;
    updateInvoiceData({ legalNotices: this.state });
  };

  paymentPenalityChanged = (e: any, value: boolean) =>
    this.setState({
      latePaymentPenality: value,
    });

  paymentConditionChanged = (e: any, value: boolean) =>
    this.setState({
      earlyPaymentCondition: value,
    });

  vatExemptionChanged = (e: any, value: boolean) =>
    this.setState({
      vatExemption: value,
    });

  recoveryPenalityChanged = (e: any, value: boolean) =>
    this.setState({
      recoveryPenality: value,
    });

  ribChanged = (e: any, value: boolean) =>
    this.setState({
      displayRIB: value,
    });

  componentDidUpdate() {
    this.autoSaveLegalNotices();
  }

  render() {
    const { form } = this.props;
    const {
      latePaymentPenality,
      earlyPaymentCondition,
      vatExemption,
      recoveryPenality,
      displayRIB,
    } = this.state;
    return (
      <CollapseCard
        shadow
        title={<FormattedMessage id="invoicing.detail.footer.header.title" />}
        className={'invoicing-footer'}
        titleAlign={'left'}
        collapsable
      >
        <Row type="flex">
          <Col xs={{ span: 24 }} md={{ span: 8 }}>
            <CheckBox
              id="checkbox-latePaymentPenality"
              defaultChecked={latePaymentPenality}
              form={form}
              label={
                <FormattedMessage id="invoicing.detail.footer.latePaymentPenality" />
              }
              onChangeCheck={this.paymentPenalityChanged}
            />
            <CheckBox
              id="checkbox-earlyPaymentCondition"
              defaultChecked={earlyPaymentCondition}
              form={form}
              label={
                <FormattedMessage id="invoicing.detail.footer.earlyPaymentCondition" />
              }
              onChangeCheck={this.paymentConditionChanged}
            />
            <CheckBox
              id="checkbox-vatExemption"
              defaultChecked={vatExemption}
              form={form}
              label={
                <FormattedMessage id="invoicing.detail.footer.vatExemption" />
              }
              onChangeCheck={this.vatExemptionChanged}
            />
          </Col>
          <Col xs={{ span: 24 }} md={{ span: 10, offset: 1 }}>
            <CheckBox
              id="checkbox-recoveryPenality"
              defaultChecked={recoveryPenality}
              form={form}
              label={
                <FormattedMessage id="invoicing.detail.footer.recoveryPenality" />
              }
              onChangeCheck={this.recoveryPenalityChanged}
            />
            <CheckBox
              id="checkbox-displayRIB"
              defaultChecked={displayRIB}
              form={form}
              label={
                <FormattedMessage id="invoicing.detail.footer.displayRIB" />
              }
              onChangeCheck={this.ribChanged}
            />
          </Col>
        </Row>
      </CollapseCard>
    );
  }
}

export default Form.create({})(AutoSave.hoc()(FooterCard));
