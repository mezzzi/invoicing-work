import { Col, Row } from 'antd';
import * as React from 'react';
import { FormattedMessage } from 'react-intl';

import { BtnType, Button } from 'components/Button';
import { Carousel } from 'components/Invoicing';
import { Content } from 'components/Layout';
import { H2, Heading } from 'components/Typo';

import { UploadFile } from 'antd/lib/upload/interface';

import LocalUpload from 'components/Form/LocalUpload';

import * as AutoSave from 'screens/Invoicing/contexts/AutoSave';

interface IProps extends AutoSave.InjectedProps {
  onGoToDetail: () => void;
}

interface IState {}

class NewInvoice extends React.PureComponent<IProps, IState> {
  getTemplateNumber = (templateName: string): string => {
    let templateNumber = '2';
    switch (templateName) {
      case 'MINIMAL':
        templateNumber = '1';
        break;
      case 'CLASSIC':
        templateNumber = '2';
        break;
      case 'STARTUP':
        templateNumber = '3';
        break;
      default:
        templateNumber = '2';
    }
    return templateNumber;
  };

  autoSaveTemplateChange = (templateName: string) => {
    const { updateInvoiceData } = this.props;
    const templateNumber = this.getTemplateNumber(templateName);
    updateInvoiceData({ templateId: templateNumber });
  };

  getAutoSavedTemplate = () => {
    const { getAutoSavedData } = this.props;
    const { templateId } = getAutoSavedData();
    // weirdo case here, templateId === 'null' check is placed here in case the value
    // is saved in the DB as null, and when wrapped in template string it turns to 'null',
    // it happened to me once, and all hell turned loose (stack overflowed due to an infinite
    // loop of component update inside the CoverFlow component)
    if (templateId && templateId !== 'null') {
      return parseInt(templateId, 10) - 1;
    } else {
      return 2;
    }
  };

  onChangeLogoUrl = (file: UploadFile, base64: string) => {
    this.autoSaveLogoUrl(base64);
  };

  onRemoveLogoUrl = (uuid: string) => {
    this.autoSaveLogoUrl('');
  };

  autoSaveLogoUrl = (logoUrl: string) => {
    const { updateInvoiceData, getAutoSavedData } = this.props;
    const {
      headerInfo: { logoUrl: alreadySavedUrl } = { logoUrl: '' },
    } = getAutoSavedData();
    if (alreadySavedUrl === logoUrl) {
      return;
    }
    updateInvoiceData({ headerInfo: { logoUrl } });
  };

  getAutoSavedUrl = () => {
    const { getAutoSavedData } = this.props;
    const {
      headerInfo: { logoUrl } = { logoUrl: undefined },
    } = getAutoSavedData();
    return logoUrl;
  };

  render() {
    const { onGoToDetail } = this.props;
    return (
      <div className="new-invoicing">
        <Content>
          <Row>
            <div className="mod-heading">
              <Heading center title="invoicing.new.header.title" />
            </div>
            <Col lg={7} md={9} xs={24}>
              <H2 style={{ color: '#AEAEAE' }}>
                1. <FormattedMessage id="invoicing.new.logo.title" />
              </H2>
              <LocalUpload
                title="Upload Logo"
                onChange={this.onChangeLogoUrl}
                onRemove={this.onRemoveLogoUrl}
                defaultPreview={this.getAutoSavedUrl()}
              />
            </Col>
            <Col
              lg={{ span: 15, offset: 2 }}
              md={{ span: 13, offset: 2 }}
              xs={{ span: 24, offset: 0 }}
              offset={2}
            >
              <H2 style={{ color: '#AEAEAE' }}>
                2. <FormattedMessage id="invoicing.new.template.title" />
              </H2>
              <Carousel
                autoSaveTemplateChange={this.autoSaveTemplateChange}
                getAutoSavedTemplate={this.getAutoSavedTemplate}
              />
            </Col>
          </Row>
        </Content>
        <div className={'new-invoicing-footer'}>
          <Button type={BtnType.Primary} onClick={onGoToDetail}>
            <FormattedMessage id="invoicing.new.footer.btn.create" />
          </Button>
        </div>
      </div>
    );
  }
}

export default AutoSave.hoc()(NewInvoice);
