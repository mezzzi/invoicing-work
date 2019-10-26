import * as Upload from 'context/Upload';
import * as React from 'react';
import { FormattedMessage, InjectedIntlProps, injectIntl } from 'react-intl';
import './UploadWrapper.module.less';

import { Icon } from 'components/Assets';
import { IconValue } from 'components/Assets/Icon';
import { isMobile } from 'react-device-detect';
import { Link } from 'react-router-dom';
import history from 'store/history';

interface IProps extends InjectedIntlProps, Upload.InjectedProps {}

interface IState {
  success: boolean;
  visible: boolean;
  blacklist: string[];
}

class UploadProgress extends React.PureComponent<IProps, IState> {
  state = {
    blacklist: ['/onboarding', '/invoice/draft', '/purchase/draft'],
    success: false,
    visible: false,
  };

  hide = () => {
    this.setState({
      success: true,
    });

    setTimeout(() => {
      let redirect = true;
      this.state.blacklist &&
        this.state.blacklist.map(item => {
          if (top.location.pathname.indexOf(item) > -1) {
            redirect = false;
          }
        });

      if (redirect) {
        history.push('/purchase/draft');
      }
      this.close();
    }, 3000);
  };

  show = () => {
    this.setState({
      success: false,
      visible: true,
    });
  };

  componentWillUnmount = () => {
    const { upload } = this.props;
    upload && upload.offFinish(this.hide);
    upload && upload.offStart(this.show);
  };

  componentDidMount = () => {
    const { upload } = this.props;
    upload && upload.onFinish(this.hide);
    upload && upload.onStart(this.show);
  };

  close = async () => {
    this.setState({
      success: false,
      visible: false,
    });
  };

  render() {
    const { intl, upload } = this.props;
    const { visible, success } = this.state;
    const filesUploading = upload && upload.filesUploading;

    return (
      <div className="upload-drawer-outer">
        <div
          className={`upload-drawer-inner ${visible ? 'visible' : 'hidden'}`}
        >
          <div className="upload-drawer-header">
            <span className="upload-invoice">
              <Icon color="#1F87FF" value={IconValue.InvoiceUpload} />
            </span>
            <div>
              <div className="upload-drawer-header-description">
                <FormattedMessage id="common.upload.drawer_description" />
              </div>
              <div className="upload-drawer-header-title">
                <FormattedMessage id="common.upload.drawer_title" />
              </div>
            </div>
            <div className="upload-drawer-header-close">
              <Icon value={IconValue.Cross} onClick={this.close} />
            </div>
          </div>
          <div className="upload-drawer-rows">
            {success && isMobile && (
              <div className="upload-drawer-row-finished">
                <FormattedMessage id="common.upload.success_mobile" />
              </div>
            )}
            {filesUploading &&
              filesUploading.map((file: any, i) => {
                let size: number = Math.round(file.original.size / 10) / 100;
                let mo: boolean = false;
                if (size > 1000) {
                  size = Math.round(file.original.size / 10000) / 100;
                  mo = true;
                }

                return (
                  <Link
                    key={`${i}`}
                    to={file.id ? `/invoice/draft/${file.id}` : '#'}
                  >
                    <div className="upload-drawer-row">
                      <div className="upload-drawer-row-loader">
                        <div
                          className={`circle-loader${
                            file.loading === false && !file.error
                              ? ' load-complete'
                              : ''
                          }${file.error ? ' load-error' : ''}`}
                        >
                          <div className="checkmark" />
                        </div>
                      </div>
                      <div className="upload-drawer-row-title">
                        <div className="upload-drawer-row-title-clip">
                          {file.original.name}
                        </div>
                        {file.error && (
                          <div className="upload-drawer-row-error">
                            {<FormattedMessage id={file.error} />}
                          </div>
                        )}
                      </div>
                      <div className="upload-drawer-row-size">
                        {intl.formatMessage(
                          {
                            id: mo
                              ? 'common.upload.size_mo'
                              : 'common.upload.size_ko',
                          },
                          { size },
                        )}
                      </div>
                    </div>
                  </Link>
                );
              })}
          </div>
        </div>
      </div>
    );
  }
}

export default injectIntl(Upload.hoc()(UploadProgress));
