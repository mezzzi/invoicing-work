import { Form, Row } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import { IconValue } from 'components/Assets/Icon';
import { Radios } from 'components/Form';
import { Content } from 'components/Layout';
import 'components/Table/Table.module.less';
import { Heading, SubHeading } from 'components/Typo';
import * as Company from 'context/Company';
import { ICompanyProvisionningStrategies } from 'context/Company/types.d';
import * as User from 'context/User';
import * as React from 'react';
import { compose } from 'react-apollo';
import { InjectedIntlProps, injectIntl } from 'react-intl';
import { RouteComponentProps } from 'react-router';

interface IProps
  extends RouteComponentProps,
    FormComponentProps,
    InjectedIntlProps,
    User.InjectedProps {}

const BankProvisionning: React.FunctionComponent<IProps> = ({
  form,
  intl,
  user,
}) => {
  const currentCompany =
    user &&
    user.data &&
    user.data.me &&
    user.data.me.currentCompany &&
    user.data.me.currentCompany;
  const provisionningStrategy =
    currentCompany && currentCompany.provisionningStrategy;

  const change = async (create: any) => {
    const newProvisionning = form.getFieldValue('provisionning');
    if (currentCompany && create) {
      await create(currentCompany.id, {
        provisionningStrategy:
          newProvisionning === ICompanyProvisionningStrategies.autoload
            ? ICompanyProvisionningStrategies.topup
            : ICompanyProvisionningStrategies.autoload,
      });
    }
  };

  return (
    <Company.Provider>
      <Company.Consumer>
        {({ company }) => (
          <Content>
            <Row type="flex">
              <Heading
                icon={IconValue.Gear}
                title={'bank.provisionning.title'}
                description={'bank.provisionning.description'}
              />
              <SubHeading title="bank.provisionning.subtitle" />
              <Radios
                onChange={change.bind(null, company && company.create)}
                defaultValue={provisionningStrategy}
                className="form-provisionning"
                form={form}
                id="provisionning"
                values={[
                  {
                    label: intl.formatMessage({
                      id: 'bank.form.radio_provisionning',
                    }),
                    value: ICompanyProvisionningStrategies.autoload,
                  },
                  {
                    label: intl.formatMessage({
                      id: 'bank.form.radio_manual',
                    }),
                    value: ICompanyProvisionningStrategies.topup,
                  },
                ]}
              />
            </Row>
          </Content>
        )}
      </Company.Consumer>
    </Company.Provider>
  );
};

export default compose(
  injectIntl,
  Form.create({}),
  User.hoc(),
)(BankProvisionning);
