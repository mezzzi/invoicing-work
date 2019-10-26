import { Icon } from 'components/Assets';
import { IconValue } from 'components/Assets/Icon';
import { Card } from 'components/Card';
import { IBeneficiary, IDocument } from 'context/Beneficiaries/types';
import * as React from 'react';
import { FormattedMessage, InjectedIntlProps, injectIntl } from 'react-intl';
import BeneficiaryCardDocument from './BeneficiaryCardDocument';
// import Step4BeneficiaryCardDocument from './Step4BeneficiaryCardDocument';

interface IProps extends InjectedIntlProps {
  beneficiary?: IBeneficiary;
  onEdit?: (beneficiary?: IBeneficiary) => void;
  onRemove?: (id: number) => void;
  onAdd?: () => void;
  hasError?: boolean;
  editable?: boolean;
}

interface IState {}

class BeneficiaryCard extends React.PureComponent<IProps, IState> {
  static defaultProps = {
    editable: false,
  };

  render() {
    const {
      beneficiary,
      onEdit,
      onRemove,
      onAdd,
      hasError,
      editable,
    } = this.props;
    let firstname;
    let lastname;
    let proofId;
    let proofAddress;

    if (beneficiary) {
      firstname = beneficiary.firstname;
      lastname = beneficiary.lastname;
      if (beneficiary.documents && beneficiary.documents.rows) {
        beneficiary.documents.rows.map((document: IDocument) => {
          if (
            document.documentTypeId === 17 ||
            document.documentTypeId === 15 ||
            document.documentTypeId === 9
          ) {
            proofId = document;
          } else if (document.documentTypeId === 12) {
            proofAddress = document;
          }
        });
      }
    }

    return (
      <div
        className={`beneficiary-card${editable ? ' editable' : ''}${
          hasError ? ' errors' : ''
        }`}
      >
        <Card
          onClick={
            editable && onEdit ? onEdit.bind(null, beneficiary) : undefined
          }
          editable={editable && beneficiary ? true : false}
          removable={editable && beneficiary ? true : false}
          onRemove={
            editable && beneficiary && onRemove
              ? onRemove.bind(null, beneficiary.userId)
              : undefined
          }
          avatar={
            (firstname || lastname) &&
            `${firstname && firstname.substring(0, 1)}${lastname &&
              lastname.substring(0, 1)}`
          }
          title={
            firstname || lastname
              ? `${firstname ? firstname : ''} ${lastname ? lastname : ''}`
              : null
          }
        >
          {beneficiary ? (
            <>
              <span
                style={{
                  textAlign: 'center',
                  textTransform: 'uppercase',
                }}
              >
                <FormattedMessage id="kyc.beneficiary.card_proof_info" />
              </span>
              <BeneficiaryCardDocument beneficiary={beneficiary} />
            </>
          ) : (
            <div onClick={onAdd} className="beneficiary-add">
              <Icon className="beneficiary-icon-add" value={IconValue.Plus} />
              <FormattedMessage id="kyc.beneficiary.beneficiary_add" />
            </div>
          )}
        </Card>
      </div>
    );
  }
}

export default injectIntl(BeneficiaryCard);
