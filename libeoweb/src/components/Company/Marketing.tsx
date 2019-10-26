import { Col, Form, Row } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import { Text } from 'components/Form';
import { H3 } from 'components/Typo';
import { ICompany } from 'context/Company/types.d';
import * as React from 'react';
import { compose } from 'react-apollo';
import { FormattedMessage, InjectedIntlProps, injectIntl } from 'react-intl';
import './Marketing.module.less';

interface IProps extends FormComponentProps, InjectedIntlProps {
  company: ICompany;
  update?: (companyId: number, infoMarketing: any) => void;
}

interface IState {}

class Marketing extends React.PureComponent<IProps, IState> {
  state = {};

  constructor(props: any) {
    super(props);
  }

  async componentDidMount() {}

  submit = async (e: React.FormEvent) => {
    e.preventDefault();
    this.props.form.validateFields(async (err, values) => {
      if (!err) {
        const { company, update } = this.props;
        if (update && company) {
          await update(company.id, values);
        }
      }
    });
  };

  onBlur = async () => {
    const fieldNames = ['domainName', 'slogan'];
    const values: any = this.props.form.getFieldsValue(fieldNames) as any;

    const { company, update } = this.props;
    if (update && company) {
      await update(company.id, values);
    }
  };

  render() {
    const { company, update, form } = this.props;

    return company ? (
      <Form className="form-marketing" onSubmit={this.submit}>
        <Row>
          <H3 className="uppercase">
            <FormattedMessage id="infos.company.marketing_title" />
          </H3>
        </Row>
        <Row gutter={33}>
          <Col span={8}>
            <Text
              onBlur={this.onBlur}
              id="domainName"
              defaultValue={company.domainName}
              label={<FormattedMessage id="infos.company.marketing_domain" />}
              form={form}
            />
          </Col>
          <Col span={8}>
            <Text
              onBlur={this.onBlur}
              id="slogan"
              defaultValue={company.slogan}
              label={<FormattedMessage id="infos.company.marketing_slogan" />}
              form={form}
            />
          </Col>
        </Row>
      </Form>
    ) : null;
  }
}

export default compose(
  injectIntl,
  Form.create({}),
)(Marketing);
