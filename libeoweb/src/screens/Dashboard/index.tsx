import { Col, Row } from 'antd';
import { IconValue } from 'components/Assets/Icon';
import { Content } from 'components/Layout';
import { Heading } from 'components/Typo';
import { ICompany, IKycStatus } from 'context/Company/types.d';
import { InvoiceStatus } from 'context/Invoice/types';
import * as Invoices from 'context/Invoices';
import * as Upload from 'context/Upload';
import * as User from 'context/User';
import { IUser } from 'context/User/types';
import * as React from 'react';
import BlocChartLine from './BlocChartLine';
import BlocChartPie from './BlocChartPie';
import BlocInvoice from './BlocInvoice';
import BlocOnboardingProgress from './BlocOnboardingProgress';
import BlocScanFacture from './BlocScanFacture';
import './Dashboard.module.less';

interface IProps extends User.InjectedProps, Upload.InjectedProps {}
interface IState {}

class Dashboard extends React.PureComponent<IProps, IState> {
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
    let loading = true;
    if (user && user.data && user.data.loading === false) {
      loading = false;
    }

    const showBlocOnboarding: boolean =
      !loading &&
      (!currentCompany || currentCompany.kycStatus !== IKycStatus.VALIDATED);

    let title = 'dashboard.incomplete.header_title';
    let description = 'dashboard.incomplete.header_description';
    if (!showBlocOnboarding) {
      title = 'dashboard.complete.header_title';
      description = 'dashboard.complete.header_description';
    }

    return (
      <Content className="dashboard">
        <Row
          type="flex"
          style={{
            justifyContent: 'flex-end',
          }}
        >
          <Heading
            loading={loading}
            title={title}
            titleVariables={me}
            description={description}
            button="dashboard.header.upload_btn"
            onClick={this.handleUpload}
          />
        </Row>
        {!loading && showBlocOnboarding && (
          <Row gutter={28} style={{ marginTop: 28 }}>
            <Col span={18}>
              <BlocOnboardingProgress />
            </Col>
          </Row>
        )}
        <Invoices.Provider
          offset={0}
          limit={1}
          count={[
            InvoiceStatus.Importing,
            InvoiceStatus.Imported,
            InvoiceStatus.Scanning,
            InvoiceStatus.Scanned,
            InvoiceStatus.ToPay,
            InvoiceStatus.Planned,
            InvoiceStatus.Paid,
          ]}
        >
          <Invoices.Consumer>
            {data => {
              const invoices =
                data.invoices &&
                data.invoices.count &&
                data.invoices.count.invoices;

              loading = true;
              if (
                data.invoices &&
                data.invoices.count &&
                data.invoices.count.loading === false
              ) {
                loading = false;
              }

              return invoices && (invoices.total > 0 || loading) ? (
                <>
                  <Row type="flex" style={{ marginTop: 28 }} gutter={28}>
                    <Col xs={24} md={18}>
                      <Row type="flex" gutter={28}>
                        <Col
                          style={{
                            marginBottom: '28px',
                          }}
                          xs={24}
                          md={12}
                        >
                          <BlocChartLine loading={loading} />
                        </Col>
                        <Col
                          style={{
                            marginBottom: '28px',
                          }}
                          xs={24}
                          md={12}
                        >
                          <BlocChartPie loading={loading} />
                        </Col>
                      </Row>
                    </Col>
                    <Col xs={24} md={6}>
                      <Row type="flex" gutter={28}>
                        <Col
                          style={{
                            marginBottom: '28px',
                          }}
                          xs={12}
                          md={24}
                        >
                          <BlocInvoice
                            loading={loading}
                            to="/purchase/draft"
                            status={[
                              InvoiceStatus.Scanning,
                              InvoiceStatus.Scanned,
                            ]}
                            color="primary"
                            description="dashboard.bloc.invoice_to_control"
                            icon={IconValue.Search}
                          />
                        </Col>
                        <Col
                          style={{
                            marginBottom: '28px',
                          }}
                          xs={12}
                          md={24}
                        >
                          <BlocInvoice
                            loading={loading}
                            to="/purchase/bills"
                            status={[
                              InvoiceStatus.ToPay,
                              InvoiceStatus.Planned,
                            ]}
                            color="red"
                            description="dashboard.bloc.invoice_to_pay"
                            icon={IconValue.WalletOut}
                          />
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                </>
              ) : (
                !loading && invoices && (
                  <Row gutter={28} style={{ marginTop: 28 }}>
                    <Col span={18}>
                      <BlocScanFacture />
                    </Col>
                  </Row>
                )
              );
            }}
          </Invoices.Consumer>
        </Invoices.Provider>
      </Content>
    );
  }
}

export default User.hoc()(Upload.hoc()(Dashboard));
