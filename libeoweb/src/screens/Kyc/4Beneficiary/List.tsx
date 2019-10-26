import { Form } from 'antd';
import { Icon } from 'components/Assets';
import { IconValue } from 'components/Assets/Icon';
import * as Beneficiaries from 'context/Beneficiaries';
import { IBeneficiary } from 'context/Beneficiaries/types';
import * as Company from 'context/Company';
import * as User from 'context/User';
import * as React from 'react';
import { compose } from 'react-apollo';
import { FormattedMessage, injectIntl } from 'react-intl';
import history from 'store/history';
import * as KycCtx from '../context';
import * as TempBeneficiary from '../FormBeneficiary/context/index';
import Manager, { IManagerProps, IManagerState } from '../Manager';
import BeneficiaryCard from './BeneficiaryCard';

interface IProps
  extends IManagerProps,
    Beneficiaries.InjectedProps,
    TempBeneficiary.InjectedProps,
    User.InjectedProps,
    Company.InjectedProps {}
interface IState extends IManagerState {
  errors: any;
}

class List extends Manager<IProps, IState> {
  static defaultProps = {
    kycProps: {
      bottomBar: true,
      btn: 'kyc.bottom.confirm',
      btnLater: 'kyc.bottom.later',
      btnLaterLink: '/',
      btnLink: '/kyc/sign',
      headingDescription: 'kyc.beneficiary.description',
      headingTitle: 'kyc.beneficiary.title',
      nextStep: 'SIGN',
      step: 'BENEFICIARIES',
    },
  };

  state = {
    btnDisabled: false,
    errors: undefined,
  };

  handleEdit: (beneficiary?: IBeneficiary) => void;
  constructor(props: any) {
    super(props);
    this.handleEdit = this.edit.bind(this);
  }

  async later() {
    return super.later();
  }

  async save() {
    const kyc = this.props.company && this.props.company.kyc;
    // if (kyc) {
    //   const result: any = await kyc(IKycStatus.BENEFICIARIES_VALIDATED);
    //   if (result.errors && result.errors.length > 0) {
    //     this.setState({ errors: result.errors });
    //   } else {
    return super.save();
    //   }
    // }
    // return false;
  }

  async edit(beneficiary?: IBeneficiary) {
    const { updateTempBeneficiary } = this.props;
    if (beneficiary && updateTempBeneficiary) {
      await updateTempBeneficiary(beneficiary.userId, 2);
    }
    history.push('/kyc/beneficiary/part-1');
  }

  render() {
    const { removeBeneficiary } = this.props;
    const errors: any = this.state.errors;

    const beneficiaries =
      (this.props.beneficiaries &&
        this.props.beneficiaries.beneficiaries &&
        this.props.beneficiaries.beneficiaries.beneficiaries &&
        this.props.beneficiaries.beneficiaries.beneficiaries.rows) ||
      [];

    return super._render(
      <div className="kyc-list">
        {errors && errors[0] && (
          <div className="beneficiary-error">
            <Icon value={IconValue.Information} />
            {typeof errors[0].message === 'string' ? (
              <FormattedMessage id={errors[0].message} />
            ) : (
              <FormattedMessage id="api.error.kyc.incomplete_beneficiaries" />
            )}
          </div>
        )}
        <div className="beneficiary-card-wrapper">
          {beneficiaries &&
            beneficiaries.map((beneficiary: IBeneficiary, i: number) => {
              let hasError: boolean = false;
              const userTag: any =
                beneficiary &&
                beneficiary.userTag &&
                JSON.parse(beneficiary.userTag);
              let visible: boolean = true;
              if (beneficiary.userStatus === 'CANCELED') {
                visible = false;
              }
              if (errors) {
                errors &&
                  errors.map((error: any) => {
                    if (error.message && error.message[beneficiary.userId]) {
                      hasError = true;
                    }
                  });
              }

              return (
                visible && (
                  <BeneficiaryCard
                    editable={userTag && userTag.userId ? false : true}
                    key={`${i}`}
                    hasError={hasError}
                    onRemove={removeBeneficiary}
                    onEdit={this.handleEdit}
                    beneficiary={beneficiary}
                  />
                )
              );
            })}

          <BeneficiaryCard onAdd={this.handleEdit} />
        </div>
      </div>,
    );
  }
}

export default compose(
  Beneficiaries.hoc(),
  Form.create({}),
  TempBeneficiary.hoc(),
  Company.hoc(),
  User.hoc(),
  KycCtx.hoc(),
  injectIntl,
)(List);
