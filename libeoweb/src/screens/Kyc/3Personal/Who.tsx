import { Form, Row } from 'antd';
import { Radios } from 'components/Form';
import * as Beneficiaries from 'context/Beneficiaries';
import { IBeneficiary, IBeneficiaryInput } from 'context/Beneficiaries/types';
import * as Company from 'context/Company';
import * as React from 'react';
import { compose } from 'react-apollo';
import { FormattedMessage, injectIntl } from 'react-intl';
import * as KycCtx from '../context';
import * as TempBeneficiary from '../FormBeneficiary/context/index';
import Manager, { IManagerProps, IManagerState } from '../Manager';

interface IProps
  extends IManagerProps,
    Beneficiaries.InjectedProps,
    TempBeneficiary.InjectedProps {}
interface IState extends IManagerState {
  hasError: boolean;
}

class Who extends Manager<IProps, IState> {
  static defaultProps = {
    kycProps: {
      bottomBar: true,
      btn: 'kyc.bottom.confirm',
      btnLater: 'kyc.bottom.later',
      btnLaterLink: '/',
      btnLink: '/kyc/personal-information/part-1',
      headingDescription: 'kyc.personal_information.who_description',
      headingTitle: 'kyc.personal_information.who_title',
      nextStep: 'PERSONNAL_INFORMATION_PART_1',
      step: 'PERSONNAL_INFORMATION',
    },
  };

  state = {
    btnDisabled: false,
    hasError: false,
  };

  constructor(props: any) {
    super(props);
  }

  async later() {
    return super.later();
  }

  async save() {
    this.props.form.validateFields(async (err: any, values: any) => {
      if (values.beneficiary) {
        const { updateTempBeneficiary } = this.props;
        let userId: number | undefined;
        let employeeType: number | undefined;
        const updatedBeneficiary: IBeneficiaryInput = {};
        const beneficiaries =
          (this.props.beneficiaries &&
            this.props.beneficiaries.beneficiaries &&
            this.props.beneficiaries.beneficiaries.beneficiaries &&
            this.props.beneficiaries.beneficiaries.beneficiaries.rows) ||
          [];

        if (values.beneficiary !== 'not_beneciary') {
          userId = parseInt(values.beneficiary, 10);
          const beneficiary = beneficiaries.find(
            (current: IBeneficiary) => current.userId === userId,
          );
          if (beneficiary && beneficiary.employeeType) {
            employeeType =
              beneficiary && beneficiary.employeeType === 0
                ? 2
                : beneficiary.employeeType;
          } else {
            employeeType = 2;
          }
        } else {
          employeeType = 3;
        }
        delete (updatedBeneficiary as any).__typename;

        if (updateTempBeneficiary) {
          await updateTempBeneficiary(userId, employeeType);
        }

        return super.save();
      } else {
        this.setState({ hasError: true });
      }
    });
    return true;
  }

  render() {
    const { hasError } = this.state;
    const { form } = this.props;
    const beneficiaries =
      (this.props.beneficiaries &&
        this.props.beneficiaries.beneficiaries &&
        this.props.beneficiaries.beneficiaries.beneficiaries &&
        this.props.beneficiaries.beneficiaries.beneficiaries.rows) ||
      [];

    const currentUser = beneficiaries.find((beneficiary: IBeneficiaryInput) => {
      const userTag = beneficiary.userTag && JSON.parse(beneficiary.userTag);
      if (userTag.userId) {
        return beneficiary;
      }
    });

    return super._render(
      <div className="kyc-who">
        {beneficiaries && beneficiaries.length > 0 && (
          <>
            <Row>
              <div className="kyc-subtitle">
                <FormattedMessage id="kyc.personal_information.who_beneficiaries_title" />
              </div>
            </Row>
            <Row>
              <Radios
                form={form}
                id="beneficiary"
                values={beneficiaries.map(
                  (beneficiary: IBeneficiary, i: number) => ({
                    checked:
                      currentUser && currentUser.userId === beneficiary.userId,
                    disabled:
                      currentUser && currentUser.userId !== beneficiary.userId
                        ? true
                        : false,
                    label: `${beneficiary.firstname} ${beneficiary.lastname}`,
                    value: beneficiary.userId,
                  }),
                )}
              />
            </Row>
          </>
        )}
        <Row>
          <div className="kyc-subtitle">
            {beneficiaries && beneficiaries.length > 0 ? (
              <FormattedMessage id="kyc.personal_information.beneficiaries_not_in_the_title" />
            ) : (
              <FormattedMessage id="kyc.personal_information.beneficiaries_no_list_title" />
            )}
          </div>
        </Row>
        <Row>
          <Radios
            form={form}
            id="beneficiary"
            values={[
              {
                disabled: currentUser ? true : false,
                label: (
                  <FormattedMessage id="kyc.beneficiary.beneciary_not_listed" />
                ),
                value: 'beneciary_not_listed',
              },
              {
                disabled: currentUser ? true : false,
                label: <FormattedMessage id="kyc.beneficiary.not_beneciary" />,
                value: 'not_beneciary',
              },
            ]}
          />
        </Row>
        <Row className="has-error">
          <span className="ant-form-explain">
            {hasError && <FormattedMessage id="kyc.beneficiary.who_error" />}
          </span>
        </Row>
      </div>,
    );
  }
}

export default compose(
  Beneficiaries.hoc(),
  Form.create({}),
  Company.hoc(),
  KycCtx.hoc(),
  TempBeneficiary.hoc(),
  injectIntl,
)(Who);
