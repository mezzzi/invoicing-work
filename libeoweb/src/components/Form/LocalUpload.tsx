import { RcFile, UploadFile } from 'antd/lib/upload/interface';
import { Icon } from 'components/Assets';
import { IconValue } from 'components/Assets/Icon';
import UploadDisplay from 'components/Upload/UploadDisplay';
import * as React from 'react';
import Dropzone from 'react-dropzone';
import { FormattedMessage } from 'react-intl';
import PDF from 'react-pdf-js';
import './LocalUpload.module.less';
const { useState } = React;

export interface ILocalUploadProps {
  title?: string;
  hasError?: boolean;
  fileTypes?: string;
  fileLimit?: number;
  errorText?: string;
  defaultPreview?: string;
  onChange?: (file: UploadFile, base64: string) => void;
  onRemove?: (uid: string) => void;
  onCancel?: (documentId: number) => void;
}

const LocalUpload: React.FunctionComponent<ILocalUploadProps> = ({
  onChange,
  onRemove,
  defaultPreview,
  hasError,
  errorText,
  title,
  fileLimit,
  fileTypes,
}) => {
  const [file, setFile] = useState<File | undefined>(undefined);
  const [preview, setPreview] = useState<string | undefined>(defaultPreview);

  const disableClick = (e: any) => {
    e.preventDefault();
  };

  const customRequest = () => ({ abort: () => {} });

  const drop = () => {};

  const accepted = async (acceptedOrRejected: File[]) => {};

  const updatePreview = async (data: File) => {
    const reader = new FileReader();
    reader.readAsDataURL(data);
    reader.onloadend = () => {
      setPreview(reader.result as string);
      setFile(data);

      onChange && onChange(data as any, reader.result as string);
    };
  };

  const beforeUpload = async (
    data: RcFile,
    FileList: RcFile[],
  ): Promise<boolean> => {
    updatePreview(data);
    return false;
  };

  const remove = () => {
    if (typeof file !== 'undefined') {
      onRemove && onRemove((file as RcFile).uid);
    }
    setPreview(undefined);
    setFile(undefined);
  };

  return (
    <div className={`local-upload-outer ${hasError ? ' has-error' : ''}`}>
      <Dropzone
        maxSize={fileLimit || 10000000}
        accept={
          fileTypes ||
          'image/jpeg, image/jpg, image/png, application/pdf, image/bmp, image/gif, image/png'
        }
        onDrop={drop}
        onDropAccepted={accepted}
        // onDropRejected={this.handleDropRejected}
      >
        {({ getRootProps, isDragActive, ...props }) => {
          return (
            <div
              {...getRootProps({
                // onClick: this.handleDisableClick
              })}
              className={`local-upload-wrapper active${
                hasError ? ' has-error' : ''
              }${isDragActive ? ' upload-visible' : 'upload-hidden'}`}
            >
              {preview ? (
                <div className="local-upload-preview">
                  <Icon
                    onClick={remove}
                    className="local-upload-preview-close"
                    value={IconValue.Cross}
                  />
                  <div className="preview-content">
                    {preview.indexOf('data:application/pdf;base64') > -1 ? (
                      <PDF file={preview} />
                    ) : (
                      <img src={preview} />
                    )}
                  </div>
                </div>
              ) : (
                <UploadDisplay
                  active
                  small
                  multiple={false}
                  title={title}
                  extension={'kyc.beneficiary.upload_extension'}
                  onCustomRequest={customRequest}
                  onBeforeUpload={beforeUpload}
                />
              )}
            </div>
          );
        }}
      </Dropzone>
      <div className="ant-form-explain">
        {hasError && errorText && <FormattedMessage id={errorText} />}
      </div>
    </div>
  );
};

export default LocalUpload;
