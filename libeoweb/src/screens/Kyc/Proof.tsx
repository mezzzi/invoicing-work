import { Icon } from 'components/Assets';
import { IconValue } from 'components/Assets/Icon';
import LocalUpload, { ILocalUploadProps } from 'components/Form/LocalUpload';
import { DocumentStatus, IDocument } from 'context/Beneficiaries/types';
import * as React from 'react';
import './Proof.module.less';

interface IProps extends ILocalUploadProps {
  children?: React.ReactNode;
  childrenAfter?: boolean;
  documents?: IDocument[];
  documentsType?: number[];
  onCancel?: (documentId: number) => void;
}

interface IState {}

class Proof extends React.PureComponent<IProps> {
  static defaultProps = {};

  render() {
    const {
      hasError,
      documents,
      onCancel,
      documentsType,
      children,
      childrenAfter,
      ...rest
    } = this.props;

    const documentsFound: IDocument[] = [];
    documents &&
      documents.map((document: IDocument, i: number) => {
        if (
          documentsType &&
          document.documentTypeId &&
          document.documentStatus !== DocumentStatus.CANCELED &&
          documentsType.indexOf(document.documentTypeId) > -1
        ) {
          documentsFound.push(document);
        }
      });

    return (
      <div className={`proof-outer ${hasError ? ' has-error' : ''}`}>
        {documentsFound.map((document: IDocument, i: number) => {
          return (
            <div className="document-proof" key={`${i}`}>
              {document.documentStatus === DocumentStatus.PENDING && (
                <Icon value={IconValue.Clock} />
              )}
              {document.documentStatus === DocumentStatus.VALIDATED && (
                <Icon value={IconValue.Checkmark} />
              )}
              {document.fileName}
              <div
                onClick={onCancel && onCancel.bind(null, document.documentId)}
                className="document-proof-remove"
              >
                <Icon value={IconValue.Cross} />
              </div>
            </div>
          );
        })}
        {!documentsFound ||
          (documentsFound.length === 0 && (
            <>
              {!childrenAfter && children}
              <LocalUpload hasError={hasError} {...rest} />
              {childrenAfter && children}
            </>
          ))}
      </div>
    );
  }
}

export default Proof;
