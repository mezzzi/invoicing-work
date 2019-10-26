import { Icon } from 'components/Assets';
import { IconValue } from 'components/Assets/Icon';
import { Button } from 'components/Button';
import { Card } from 'components/Card';
import { ICompany, IKycStatus } from 'context/Company/types.d';
import * as Upload from 'context/Upload';
import * as User from 'context/User';
import { IUser } from 'context/User/types';
import * as React from 'react';
import { FormattedMessage } from 'react-intl';

interface IProps extends User.InjectedProps, Upload.InjectedProps {}
interface IState {}

class BlocScanFacture extends React.PureComponent<IProps, IState> {
  state = {};

  handleUpload: () => void;

  constructor(props: any) {
    super(props);

    this.handleUpload = this.upload.bind(this);
  }

  upload() {
    const { upload } = this.props;
    const setVisibility = upload && upload.setVisibility;
    if (setVisibility) {
      setVisibility(true);
    }
  }

  render() {
    const { user } = this.props;
    const me: IUser = user && user.data && user.data.me;
    const currentCompany: ICompany = me && me.currentCompany;

    let currentStep: number = 0;
    if (currentCompany) {
      if (
        typeof currentCompany.kycStatus === 'undefined' ||
        currentCompany.kycStatus === null
      ) {
        currentStep = 0;
      } else {
        switch (currentCompany.kycStatus) {
          case IKycStatus.BENEFICIARIES_VALIDATED:
            currentStep = 2;
            break;
          default:
            currentStep = 1;
            break;
        }
      }
    }

    return (
      <Card
        center
        className="card-dashboard"
        style={{
          flexDirection: 'row',
        }}
        shadow
      >
        <Icon color="#1F87FF" value={IconValue.InvoiceScan} />
        <div className="card-dashboard-title">
          <FormattedMessage id="dashboard.incomplete.import_facture_title" />
        </div>
        <div className="card-dashboard-description">
          <FormattedMessage id="dashboard.incomplete.import_facture_description" />
        </div>
        <Button onClick={this.handleUpload}>
          <FormattedMessage id="dashboard.incomplete.btn_import_facture" />
        </Button>
      </Card>
    );
  }
}

export default User.hoc()(Upload.hoc()(BlocScanFacture));
