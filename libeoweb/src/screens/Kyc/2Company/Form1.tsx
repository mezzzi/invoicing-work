import { Col, Form, Row } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import { Icon } from 'components/Assets';
import { IconValue } from 'components/Assets/Icon';
import { Date, Select, SelectOption, Text } from 'components/Form';
import { AutocompleteSiren } from 'components/Search';
import * as Company from 'context/Company';
import { IInputCompany } from 'context/Company/types.d';
import * as Siren from 'context/Siren';
import * as React from 'react';
import { compose } from 'react-apollo';
import { FormattedMessage, injectIntl } from 'react-intl';
import { withRouter } from 'react-router';
import { toPickerDate } from 'utils/common';
import legalForm from 'utils/legal-form';
import * as KycCtx from '../context';
import Manager, { IManagerProps, IManagerState } from '../Manager';
import * as TempCompany from './context/index';

interface IProps
  extends IManagerProps,
    TempCompany.InjectedProps,
    Siren.InjectedProps,
    FormComponentProps {}
interface IState extends IManagerState {
  companySelectedFromAutocomplete: boolean;
  legalForms: any;
}

class Form1 extends Manager<IProps, IState> {
  static defaultProps = {
    kycProps: {
      bottomBar: true,
      step: 'COMPANY',

      btn: 'kyc.bottom.confirm',
      btnLink: '/kyc/company/address',

      btnLater: 'kyc.bottom.later',
      btnLaterLink: '/',

      headingDescription: 'kyc.company.description',
      headingTitle: 'kyc.company.title',
    },
  };

  state = {
    btnDisabled: true,
    btnLoading: false,
    companySelectedFromAutocomplete: false,
    legalForms: {},
  };

  handleSelect: (item: IInputCompany) => void;
  handleSearch: () => void;
  handleAddNew: () => void;
  handleScrollEnd: (more: any) => void;
  constructor(props: any) {
    super(props);
    this.handleSelect = this.select.bind(this);
    this.handleSearch = this.search.bind(this);
    this.handleAddNew = this.addNew.bind(this);
    this.handleScrollEnd = this.scrollEnd.bind(this);
  }

  async componentDidMount() {
    super.componentDidMount();
    const legalForms = await legalForm.all();
    this.setState({ legalForms });
  }

  async save() {
    this.props.form.validateFields(async (err: any, values: any) => {
      if (!err) {
        this.setState({ btnLoading: true });
        const { updateTempCompany, tempCompany } = this.props;

        const company: IInputCompany = {
          ...tempCompany,
          brandName: values.brandName,
          capital: parseFloat(values.capital),
          incorporationAt: values.incorporationAt,
          legalForm: values.legalForm,
          name: values.name,
          siren: values.siret && values.siret.slice(0, 9),
          siret: values.siret,
        };

        await updateTempCompany(company);
        return super.save();
      }
    });
    return false;
  }

  scrollEnd(more: any) {
    more && more();
  }

  async select(item: IInputCompany) {
    const { updateTempCompany, siren, form } = this.props;
    const company = item;
    form.resetFields();

    updateTempCompany(company);

    this.setState({
      btnDisabled: false,
      companySelectedFromAutocomplete: true,
    });
  }

  addNew() {
    const { updateTempCompany, form } = this.props;
    form.resetFields();
    updateTempCompany({});

    this.setState({
      btnDisabled: false,
      companySelectedFromAutocomplete: false,
    });
  }

  search() {
    const { updateTempCompany, tempCompany, siren } = this.props;
    updateTempCompany(undefined);

    this.setState({
      btnDisabled: true,
      companySelectedFromAutocomplete: false,
    });
  }

  render() {
    const { intl, form, tempCompany } = this.props;
    const { companySelectedFromAutocomplete, legalForms } = this.state;

    let FormCompany: React.ReactNode;
    if (typeof tempCompany !== 'undefined') {
      const company: IInputCompany = tempCompany;
      FormCompany = (
        <>
          <Row gutter={28}>
            <Col xs={24} lg={12}>
              <Text
                defaultValue={(company && company.name) || company.brandName}
                id="name"
                label={<FormattedMessage id="kyc.company.form_name" />}
                rules={[
                  {
                    message: intl.formatMessage({
                      id: 'kyc.company.form_name_error',
                    }),
                    required: true,
                  },
                ]}
                form={form}
              />
            </Col>
          </Row>
          <Row gutter={28}>
            <Col xs={12} lg={6}>
              <Select
                defaultValue={
                  company && company.legalForm ? company.legalForm : null
                }
                showSearch
                id="legalForm"
                label={<FormattedMessage id="kyc.company.form_legalForm" />}
                rules={[
                  {
                    message: intl.formatMessage({
                      id: 'kyc.company.form_legalForm_error',
                    }),
                    required: true,
                  },
                ]}
                form={form}
                options={Object.keys(legalForms).map(
                  (key: string, i: number) => {
                    return (
                      <SelectOption key={key} value={key}>
                        {(legalForms as any)[key]}
                      </SelectOption>
                    );
                  },
                )}
              />
            </Col>
            <Col xs={12} lg={6}>
              <Text
                defaultValue={company && company.siret}
                id="siret"
                label={<FormattedMessage id="kyc.company.form_siret" />}
                rules={[
                  {
                    message: intl.formatMessage({
                      id: 'kyc.company.form_siret_error',
                    }),
                    required: true,
                  },
                ]}
                form={form}
              />
            </Col>
          </Row>
          <Row gutter={28}>
            <Col xs={12} lg={6}>
              <Text
                defaultValue={company && company.capital}
                id="capital"
                label={<FormattedMessage id="kyc.company.form_capital" />}
                rules={[
                  {
                    message: intl.formatMessage({
                      id: 'kyc.company.form_capital_error',
                    }),
                    required: true,
                  },
                ]}
                form={form}
              />
            </Col>
            <Col xs={12} lg={6}>
              <Date
                defaultValue={
                  company.incorporationAt
                    ? toPickerDate(company.incorporationAt)
                    : null
                }
                id="incorporationAt"
                label={
                  <FormattedMessage id="kyc.company.form_incorporationAt" />
                }
                rules={[
                  {
                    message: intl.formatMessage({
                      id: 'kyc.company.form_incorporationAt_error',
                    }),
                    required: true,
                  },
                ]}
                form={form}
              />
            </Col>
          </Row>
        </>
      );
    }

    return super._render(
      <>
        <Row gutter={28}>
          <Col xs={24} lg={12}>
            <AutocompleteSiren
              form={form}
              onValueChange={this.handleSearch}
              footer={
                <div>
                  <div className="footer-hint">
                    <FormattedMessage id="kyc.company.search_footer_hint" />
                  </div>
                  <div onClick={this.handleAddNew} className="footer-cta">
                    <Icon value={IconValue.ArrowReturn} />
                    <FormattedMessage id="kyc.company.search_footer_cta" />
                  </div>
                </div>
              }
              placeholder="kyc.company.search_placeholder"
              type="companies"
              inline={true}
              onSelect={this.handleSelect}
            />
          </Col>
        </Row>
        {FormCompany}
      </>,
    );
  }
}

// export default Form1;
export default compose(
  Form.create({}),
  KycCtx.hoc(),
  Company.hoc(),
  Siren.hoc(),
  withRouter,
  TempCompany.hoc(),
  injectIntl,
)(Form1);
