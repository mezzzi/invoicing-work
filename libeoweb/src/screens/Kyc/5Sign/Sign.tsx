import { Form } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import { Checkbox } from 'components/Form';
import * as Company from 'context/Company';
import * as React from 'react';
import { compose } from 'react-apollo';
import { FormattedMessage, InjectedIntlProps, injectIntl } from 'react-intl';
import PDF from 'react-pdf-js';
import { staticAssets } from 'utils/common';
import * as KycCtx from '../context';
import Manager, { IManagerProps, IManagerState } from '../Manager';

interface IProps
  extends IManagerProps,
    FormComponentProps,
    Company.InjectedProps,
    InjectedIntlProps,
    Company.InjectedProps {}
interface IState extends IManagerState {
  pages: number;
  contract?: string;
}

class Sign extends Manager<IProps, IState> {
  static defaultProps = {
    kycProps: {
      bottomBar: true,
      btn: 'kyc.bottom.confirm',
      btnLater: 'kyc.bottom.later',
      btnLaterLink: '/',
      btnLink: '/kyc/iban',
      headingDescription: 'kyc.sign.description',
      headingTitle: 'kyc.sign.title',
      nextStep: 'IBAN',
      step: 'SIGN',
    },
  };

  state = {
    btnDisabled: false,
    btnLoading: false,
    contract: undefined,
    pages: 0,
  };

  handleOnDocumentComplete: (props: any) => void;
  constructor(props: any) {
    super(props);
    this.handleOnDocumentComplete = this.onDocumentComplete.bind(this);
  }

  onDocumentComplete(pages: any) {
    this.setState({ pages });
  }

  async later() {
    return super.later();
  }

  async save() {
    this.props.form.validateFields(async (err: any, values: any) => {
      if (!err) {
        this.setState({ btnLoading: true });
        const { company } = this.props;
        if (company && company.signContract) {
          await company.signContract();
        }
        return super.save();
      }
    });
    return false;
  }

  async componentDidMount() {
    super.componentDidMount();
    const { company } = this.props;

    if (company && company.getContract) {
      const contract: string | undefined = await company.getContract();

      if (contract) {
        this.setState({
          contract,
        });
      }
    }
  }

  render() {
    const { company, form, intl } = this.props;
    const { pages, contract } = this.state;

    return super._render(
      <>
        <div className="sign-contract-wrapper">
          {contract && (
            // <PDF
            //   scale={5}
            //   className="sign-contract"
            //   onDocumentComplete={this.handleOnDocumentComplete}
            //   file={staticAssets(contract)}
            //   page={1}
            // />
            <PDF
              scale={5}
              className="sign-contract"
              onDocumentComplete={this.handleOnDocumentComplete}
              file="https://libeo-prod.s3-eu-west-1.amazonaws.com/asset/contract/contract.pdf"
              page={1}
            />
          )}
          {pages - 1 > 0 &&
            Array.from(Array(pages - 1).keys()).map(
              (p, i) =>
                contract && ( // TODO: feature-contract-sign
                  // <PDF
                  //   key={`${i}`}
                  //   className="sign-contract"
                  //   file={staticAssets(contract)}
                  //   page={i + 2}
                  // />
                  <PDF
                    key={`${i}`}
                    className="sign-contract"
                    file="https://libeo-prod.s3-eu-west-1.amazonaws.com/asset/contract/contract.pdf"
                    page={i + 2}
                  />
                ),
            )}
        </div>
        <div className="sign-contract-checkbox">
          <Checkbox
            id="accept"
            label={<FormattedMessage id="kyc.sign.accept" />}
            rules={[
              {
                message: intl.formatMessage({
                  id: 'kyc.sign.accept_error',
                }),
                required: true,
              },
            ]}
            form={form}
          />
        </div>
      </>,
    );
  }
}

export default compose(
  Company.hoc(),
  KycCtx.hoc(),
  Form.create({}),
  injectIntl,
)(Sign);
