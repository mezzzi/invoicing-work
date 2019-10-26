import { Upload } from 'antd';
import { Button } from 'components/Button';
import * as React from 'react';
import { FormattedMessage, InjectedIntlProps, injectIntl } from 'react-intl';
import './UploadWrapper.module.less';

import { RcFile } from 'antd/lib/upload/interface';
import { Icon } from 'components/Assets';
import { IconValue } from 'components/Assets/Icon';

interface IProps extends InjectedIntlProps {
  btn?: string;
  drag?: boolean;
  title?: string;
  extension?: string;
  active?: boolean;
  small?: boolean;
  multiple: boolean;
  onClose?: () => void;
  onCustomRequest?: () => void;
  onBeforeUpload?: (file: RcFile, FileList: RcFile[]) => Promise<boolean>;
}

interface IState {}

class UploadComponent extends React.PureComponent<IProps, IState> {
  state = {};

  render() {
    const {
      onClose,
      multiple,
      onBeforeUpload,
      onCustomRequest,
      small,
      active,
      btn,
      drag,
      title,
      extension,
    } = this.props;
    return (
      <div
        className={`upload-wrapper${small ? ' small' : ''}${
          active ? ' active' : ''
        }`}
      >
        <div className="upload-animated">
          <div onClick={onClose} className="upload-btn-close">
            <Icon value={IconValue.Cross} />
          </div>

          <Upload
            disabled={drag}
            className="upload-click-wrapper"
            customRequest={onCustomRequest}
            fileList={undefined}
            beforeUpload={onBeforeUpload}
            multiple={multiple}
            accept="image/jpeg, image/jpg, image/png, application/pdf, image/bmp, image/gif, image/png"
          >
            <div className="upload-bordered" />
            <Icon value={IconValue.CloudUpload} className="upload-cloud-icon" />
            {title && (
              <span className="upload-title">
                <FormattedMessage id={title} />
              </span>
            )}
            {extension && (
              <span className="upload-extenssion">
                <FormattedMessage id={extension} />
              </span>
            )}
            <div className="upload-facture upload-facture-1">
              <Icon value={IconValue.Facture} />
            </div>
            <div className="upload-facture upload-facture-2">
              <Icon value={IconValue.Facture} />
            </div>
            <div className="upload-facture upload-facture-3">
              <Icon value={IconValue.Facture} />
            </div>
            {btn && (
              <div className="btn-upload-wrapper">
                <Button
                  icon={<Icon value={IconValue.Plus} />}
                  className="btn-upload-manual"
                >
                  <FormattedMessage id={btn} />
                </Button>
              </div>
            )}
          </Upload>
        </div>
      </div>
    );
  }
}

export default injectIntl(UploadComponent);
