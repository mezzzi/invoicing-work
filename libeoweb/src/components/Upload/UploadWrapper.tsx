import * as Alert from 'context/Alert';
import * as React from 'react';
import { isMobile } from 'react-device-detect';
import { InjectedIntlProps, injectIntl } from 'react-intl';
import './UploadWrapper.module.less';

import { RcFile } from 'antd/lib/upload/interface';
import { DropzoneInputProps, DropzoneRootProps } from 'react-dropzone';
import UploadDisplay from './UploadDisplay';
import UploadProgress from './UploadProgress';

interface IProps extends Alert.InjectedProps, InjectedIntlProps {
  drag?: boolean;
  rootProps: DropzoneRootProps;
  inputProps: DropzoneInputProps;
  onClickUpload: (acceptedOrRejected: File) => void;
  children?: React.ReactNode;
  visible: boolean;
  setVisibility: (visible: boolean) => void;
}

interface IState {}

class UploadComponent extends React.PureComponent<IProps, IState> {
  state = {};

  handleClose: () => void;
  handleCustomRequest: () => void;
  handleBeforeUpload: (file: RcFile, FileList: RcFile[]) => Promise<boolean>;

  constructor(props: any) {
    super(props);

    this.handleClose = this.close.bind(this);
    this.handleCustomRequest = this.customRequest.bind(this);
    this.handleBeforeUpload = this.beforeUpload.bind(this);
  }

  close() {
    const { setVisibility } = this.props;
    if (setVisibility) {
      setVisibility(false);
    }
  }

  customRequest() {
    // disable default ant design upload
    return {};
  }

  async beforeUpload(file: RcFile, FileList: RcFile[]) {
    const { onClickUpload, alert, setVisibility } = this.props;

    if (onClickUpload) {
      await onClickUpload(file as File);
    }

    return false;
  }

  render() {
    const { children, visible, rootProps, intl, drag } = this.props;
    return (
      <div
        {...rootProps}
        className={`upload-zone${
          visible || isMobile ? ' upload-visible' : ' upload-hidden'
        }`}
      >
        <div className="upload-children">{children}</div>
        <UploadProgress />
        <UploadDisplay
          drag={drag}
          multiple
          btn={
            isMobile
              ? 'common.upload.btn_manual_mobile'
              : 'common.upload.mobile_drag_and_drop'
          }
          title={
            isMobile
              ? 'common.upload.drag_and_drop'
              : 'common.upload.btn_manual'
          }
          extension={'common.upload.accepted_extenssions'}
          active={visible || isMobile}
          onClose={this.handleClose}
          onCustomRequest={this.handleCustomRequest}
          onBeforeUpload={this.handleBeforeUpload}
        />
      </div>
    );
  }
}

export default injectIntl(Alert.hoc()(UploadComponent));
