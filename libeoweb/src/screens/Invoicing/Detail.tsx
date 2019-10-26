import { Form, Modal } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import * as React from 'react';
import { FormattedMessage } from 'react-intl';

import { Icon } from 'components/Assets';
import { IconValue } from 'components/Assets/Icon';
import { BtnType, Button } from 'components/Button';
import { InvoicingIcon } from 'components/Invoicing/Assets';
import { InvoicingIconValue } from 'components/Invoicing/Assets/Icon';
import { Content } from 'components/Layout';
import Footer from 'screens/Invoicing/DetailFooter';
import DetailGeneralInfo from 'screens/Invoicing/DetailGeneralInfo';
import Header from 'screens/Invoicing/DetailHeader';
import DetailProducts from 'screens/Invoicing/DetailProducts';

import * as AutoSave from 'screens/Invoicing/contexts/AutoSave';
import TemplateRenderer from './TemplateRenderer';

interface IProps extends FormComponentProps, AutoSave.InjectedProps {}

interface IState {
  showPreview: boolean;
  pdfPath: string;
  templateId: number;
}

class HeaderCard extends React.PureComponent<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      pdfPath: `https://cors-anywhere.herokuapp.com/http://www.orimi.com/pdf-test.pdf`,
      showPreview: false,
      templateId: 1,
    };
    this.setSelectedTemplate();
  }

  togglePreview = () => {
    this.setState({
      showPreview: !this.state.showPreview,
    });
  };

  setSelectedTemplate = () => {
    const { getAutoSavedData } = this.props;
    const { templateId } = getAutoSavedData();
    if (templateId) {
      this.state = {
        ...this.state,
        templateId: parseInt(templateId, 10),
      };
    }
  };

  render() {
    const { form } = this.props;
    const { pdfPath, showPreview, templateId } = this.state;

    return (
      <>
        {showPreview ? (
          <div className="template-wrapper">
            <TemplateRenderer templateId={templateId} />
          </div>
        ) : (
          <Content className={'detail-invoicing'} style={{ height: 'auto' }}>
            <Header />
            <div className="detail-body">
              <DetailGeneralInfo />
              <DetailProducts />
            </div>
            <Footer />
          </Content>
        )}

        <div className={'detail-invoicing-footer'}>
          <div>
            <a className={'footer-link'} onClick={this.togglePreview}>
              <Icon value={IconValue.EyeOpen} />
              {showPreview ? (
                <FormattedMessage id="invoicing.detail.stickyfooter.edit" />
              ) : (
                <FormattedMessage id="invoicing.detail.stickyfooter.preview" />
              )}
            </a>
            <a className={'footer-link'}>
              <InvoicingIcon value={InvoicingIconValue.Attach} />
              <FormattedMessage id="invoicing.detail.stickyfooter.attach" />
            </a>
          </div>
          <div>
            <span className="auto-save">
              <Icon
                style={{ marginRight: '5px' }}
                value={IconValue.Checkmark}
              />
              <FormattedMessage id="invoicing.detail.stickyfooter.autosave" />
            </span>
            {showPreview ? (
              <form method="get" action={pdfPath}>
                <Button type={BtnType.Primary} submit={true}>
                  <FormattedMessage id="invoicing.detail.stickyfooter.download" />
                </Button>
              </form>
            ) : (
              <Button type={BtnType.Primary}>
                <FormattedMessage id="invoicing.detail.stickyfooter.continue" />
              </Button>
            )}
          </div>
        </div>
        {/* <Modal width={'100%'} visible={this.state.showPreview} footer={null}>
          <div>
            <div className="modal-wrapper">
              <div className="template-wrapper">
                <TemplateRenderer templateId={templateId} />
              </div>
            </div>
            <div className={'detail-invoicing-footer pad-6em'}>
              <div>
                <a
                  className={'footer-link edit-modal'}
                  onClick={this.togglePreview}
                >
                  <Icon value={IconValue.Edit} />
                  <FormattedMessage id="invoicing.detail.stickyfooter.edit" />
                </a>
                <a className={'footer-link'}>
                  <InvoicingIcon value={InvoicingIconValue.Attach} />
                  <FormattedMessage id="invoicing.detail.stickyfooter.attach" />
                </a>
              </div>
            </div>
          </div>
        </Modal> */}
      </>
    );
  }
}

export default Form.create({})(AutoSave.hoc()(HeaderCard));
