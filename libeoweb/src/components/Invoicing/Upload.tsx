import { message, Row, Upload } from 'antd';
import { Icon } from 'components/Assets';
import { IconValue } from 'components/Assets/Icon';
import { Button } from 'components/Button';
import { P } from 'components/Typo';
import * as React from 'react';
import { FormattedMessage } from 'react-intl';

const Dragger = Upload.Dragger;

const getBase64 = (img: any, callback: (logoUrl: string) => void) => {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(`${reader.result}`));
  reader.readAsDataURL(img);
};

const beforeUpload = (file: File) => {
  const isJPG = file.type === 'image/jpeg';
  const isPNG = file.type === 'image/png';

  if (!(isJPG || isPNG)) {
    message.error('You can only upload JPG or PNG file!');
  }
  const isLt5M = file.size / 1024 / 1024 < 5;
  if (!isLt5M) {
    message.error('Image must smaller than 5MB!');
  }
  return (isJPG || isPNG) && isLt5M;
};

const dummyRequest = ({ file, onSuccess }: { file: any; onSuccess: any }) => {
  setTimeout(() => {
    onSuccess('ok');
  }, 0);
};

const uploadProps = {
  customRequest: dummyRequest,
  multiple: false,
  name: 'file',
  showUploadList: false,
};

interface IProps {
  onLogoUrlChange: (logoUrl: string) => void;
  getAutoSavedUrl: () => string;
}

interface IState {
  loading: boolean;
  logoUrl: string;
}

class UploadComponent extends React.PureComponent<IProps, IState> {
  state = {
    loading: false,
    logoUrl: '',
  };

  componentWillMount() {
    const { getAutoSavedUrl } = this.props;
    const logoUrl = getAutoSavedUrl && getAutoSavedUrl();
    this.setState({
      logoUrl,
    });
  }

  handleChange = (info: any) => {
    if (info.file.status === 'uploading') {
      this.setState({ loading: true });
      return;
    }
    if (info.file.status === 'done') {
      // Get this url from response in real world.
      getBase64(
        info.file.originFileObj,
        (logoUrl: string): void => {
          this.setState(
            {
              loading: false,
              logoUrl,
            },
            () => {
              const { onLogoUrlChange } = this.props;
              onLogoUrlChange(logoUrl);
            },
          );
        },
      );
    }
  };

  render() {
    return (
      <div className="invoicing upload-component">
        <Dragger
          {...uploadProps}
          beforeUpload={beforeUpload}
          onChange={this.handleChange}
        >
          <Row justify="center">
            {this.state.logoUrl ? (
              <img src={this.state.logoUrl} alt="" />
            ) : (
              <>
                <Row type="flex" justify="center">
                  <Icon value={IconValue.CloudUpload} className="upload-icon" />
                </Row>
                <Row type="flex" justify="center" className="drop-title">
                  <FormattedMessage id="invoicing.new.logo.drop.title" />
                </Row>
                <Row type="flex" justify="center" className="drop-description">
                  <FormattedMessage id="invoicing.new.logo.drop.description1" />
                </Row>
                <Row type="flex" justify="center" className="drop-description">
                  <FormattedMessage id="invoicing.new.logo.drop.description2" />
                </Row>
              </>
            )}
          </Row>
        </Dragger>
        <Row type="flex" justify="center">
          <Upload
            {...uploadProps}
            beforeUpload={beforeUpload}
            onChange={this.handleChange}
          >
            <Button
              icon={<Icon value={IconValue.Plus} />}
              className="btn-logo-add"
            >
              <FormattedMessage id="invoicing.new.logo.btn.add" />
            </Button>
          </Upload>
        </Row>
        <Row type="flex" justify="center">
          <P className="description">
            <FormattedMessage id="invoicing.new.logo.footer.description" />{' '}
          </P>
        </Row>
      </div>
    );
  }
}

export default UploadComponent;
