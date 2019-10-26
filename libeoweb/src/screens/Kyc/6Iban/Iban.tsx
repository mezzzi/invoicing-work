import { Col, Row } from 'antd';
import img from 'assets/images/kyc-4.svg';
import { BtnType, Button } from 'components/Button';
import Iban from 'components/Form/Iban';
import { Heading } from 'components/Typo';
import * as User from 'context/User';
import * as React from 'react';
import { compose } from 'react-apollo';
import { FormattedMessage } from 'react-intl';
import * as KycCtx from '../context';
import Manager, { IManagerProps, IManagerState } from '../Manager';
const Img: any = img;

interface IProps extends IManagerProps, User.InjectedProps {}
interface IState extends IManagerState {}

class IbanForm extends Manager<IProps, IState> {
  static defaultProps = {
    kycProps: {
      bottomBar: false,
      headingTitle: undefined,
    },
  };

  state = {};

  render() {
    return (
      <div className="transition-iban">
        <div
          style={{
            marginBottom: 40,
          }}
        >
          <Heading
            small
            center
            title="kyc.iban.title"
            description="kyc.iban.description"
          />
        </div>
        <Row
          style={{
            maxWidth: '500px',
            width: '100%',
          }}
        >
          <Col className="iban-wrapper" span={24}>
            <Iban />
          </Col>
        </Row>
        <Button
          to="/"
          type={BtnType.Primary}
          center
          style={{
            marginBottom: 40,
          }}
        >
          <FormattedMessage id="kyc.iban.btn" />
        </Button>
        <Img />
      </div>
    );
  }
}

export default compose(KycCtx.hoc())(IbanForm);
