import { Icon } from 'components/Assets';
import { IconValue } from 'components/Assets/Icon';
import {
  DocumentStatus,
  IBeneficiary,
  IDocument,
} from 'context/Beneficiaries/types';
import * as React from 'react';
import { FormattedMessage, InjectedIntlProps, injectIntl } from 'react-intl';

interface IProps extends InjectedIntlProps {
  beneficiary?: IBeneficiary;
}

interface IState {}

class BeneficiaryCardDocument extends React.PureComponent<IProps, IState> {
  render() {
    const { beneficiary } = this.props;

    return beneficiary ? (
      <>
        {beneficiary.documents &&
          beneficiary.documents.rows.map((document: IDocument, i: number) => {
            return (
              document.documentStatus !== DocumentStatus.CANCELED && (
                <div key={`${i}`} className="beneficiary-card-proof">
                  {document.documentStatus === DocumentStatus.VALIDATED && (
                    <Icon value={IconValue.Checkmark} className="valid" />
                  )}
                  {document.documentStatus === DocumentStatus.PENDING && (
                    <Icon value={IconValue.Clock} className="waiting" />
                  )}
                  {document.documentType === 'ID' && (
                    <FormattedMessage id="kyc.beneficiary.document_id" />
                  )}
                  {document.documentTypeId === 2 && (
                    <FormattedMessage id="kyc.beneficiary.document_address" />
                  )}
                  {document.documentTypeId === 18 && (
                    <FormattedMessage id="kyc.beneficiary.document_power" />
                  )}
                </div>
              )
            );
          })}
      </>
    ) : null;
  }
}

export default injectIntl(BeneficiaryCardDocument);
