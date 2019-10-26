import { Col, Row } from 'antd';
import { Icon } from 'components/Assets';
import { IconValue } from 'components/Assets/Icon';
import { DialogTransfert } from 'components/Dialog';
import { A } from 'components/Typo';
import { IHistories } from 'context/Common/types';
import { IInvoice, InvoiceStatus } from 'context/Invoice/types';
import moment from 'moment';
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import Card from './Card';
import './News.module.less';

interface IProps {
  history: IHistories;
  invoice: IInvoice;
}

const News: React.FunctionComponent<IProps> = ({ history, invoice }) => {
  const [dialogTransfertVisible, setDialogTransfertVisible] = React.useState(
    false,
  );

  const toggleDialogTransfert = (
    display: boolean,
    e: React.MouseEvent<HTMLElement>,
  ) => {
    e.stopPropagation();
    e.preventDefault();
    setDialogTransfertVisible(display);
  };

  const rows =
    history &&
    history.rows &&
    history.rows.map((status, i) => {
      let icon: React.ReactNode;
      let visible: boolean = false;
      let label: string = `invoice.status.${status.event}_${
        status.params.status
      }`;

      switch (status.params.status) {
        case InvoiceStatus.Importing:
          icon = <Icon value={IconValue.Buy} />;
          visible = true;
          break;
        case InvoiceStatus.Imported:
          icon = <Icon value={IconValue.CloudUpload} />;
          visible = true;
          break;
        case InvoiceStatus.Scanned:
          if (status.params.oldStatus === InvoiceStatus.ToPay) {
            label = `${label}_EDITED`;
          }
          icon = <Icon value={IconValue.Search} />;
          visible = true;
          break;
        case InvoiceStatus.ToPay:
          if (status.params.oldStatus === InvoiceStatus.Planned) {
            label = `${label}_CANCEL`;
          }
          icon = (
            <Icon
              value={
                status.params.oldStatus === InvoiceStatus.Planned
                  ? IconValue.Cross
                  : IconValue.ThumbsUp
              }
            />
          );
          visible = true;
          break;
        case InvoiceStatus.BusinessValidation:
          icon = <Icon value={IconValue.CloudUpload} />;
          visible = true;
          break;
        case InvoiceStatus.Planned:
          icon = <Icon value={IconValue.Clock} />;
          visible = true;
          break;
        case InvoiceStatus.Paid:
          icon = <Icon value={IconValue.Checkmark} />;
          visible = true;
          break;
        case InvoiceStatus.MarkedAsPaidByReceiver:
          icon = <Icon value={IconValue.CloudUpload} />;
          visible = true;
          break;
      }

      return visible ? (
        <Row key={`${i}`} className="row news-row" type="flex">
          <Col>{icon}</Col>
          <Col
            style={{
              flex: 1,
            }}
          >
            <div>
              <span className="value">
                <FormattedMessage
                  id={label}
                  values={{
                    firstname: status.user && status.user.firstname,
                    lastname: status.user && status.user.lastname,
                    paymentAt: moment(status.params.paymentAt).format(
                      'DD/MM/YYYY',
                    ),
                  }}
                />
              </span>
            </div>
            <div>
              <span className="date">
                {moment(status.createdAt).format('DD/MM/YYYY HH:mm')}
              </span>
            </div>
            {invoice &&
            status.params.status === InvoiceStatus.Planned &&
            invoice.estimatedBalance < 0 ? (
              <div className="warning">
                <Icon
                  style={{
                    height: 15,
                    marginTop: 0,
                    width: 15,
                  }}
                  value={IconValue.Warning}
                  className="warning"
                />
                <FormattedMessage id="invoice.detail.warning_balance" />
                <span onClick={toggleDialogTransfert.bind(null, true)}>
                  <A
                    style={{
                      cursor: 'pointer',
                      fontSize: 12,
                      paddingLeft: 10,
                    }}
                    tag="div"
                  >
                    <FormattedMessage id="invoice.detail.warning_refund" />
                  </A>
                </span>
              </div>
            ) : null}
          </Col>
        </Row>
      ) : null;
    });

  return (
    <>
      <DialogTransfert
        onCancel={toggleDialogTransfert.bind(null, false)}
        visible={dialogTransfertVisible}
      />
      <Card title="invoice.detail.news_title">{rows}</Card>
    </>
  );
};

export default News;
