import { Form, Radio, Row, Tag } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import { RadioChangeEvent } from 'antd/lib/radio';
import { Icon } from 'components/Assets';
import { IconValue } from 'components/Assets/Icon';
import { Table } from 'components/Table';
import 'components/Table/Table.module.less';
import * as BankCtx from 'context/Bank';
import {
  IBankAccount,
  IBankAccounts,
  IMandate,
  MandateStatus,
} from 'context/Bank/types';
import * as React from 'react';
import { compose } from 'react-apollo';
import { FormattedMessage, InjectedIntlProps, injectIntl } from 'react-intl';
import { Link } from 'react-router-dom';

interface IProps extends FormComponentProps, InjectedIntlProps {
  loading?: boolean;
  defaultBankAccount?: IBankAccount;
  bankAccounts?: IBankAccount[];
  onChangeDefaultBankAccount?: (id: string, e: RadioChangeEvent) => void;
  onRemove?: (id: string) => void;
}

const BankList: React.FunctionComponent<IProps> = ({
  loading = false,
  defaultBankAccount,
  bankAccounts = [],
  onChangeDefaultBankAccount = () => {},
  onRemove = () => {},
  form,
  intl,
}) => {
  const { getFieldDecorator } = form;

  return (
    <>
      {getFieldDecorator('default-bank-account', {
        initialValue: defaultBankAccount && defaultBankAccount.id,
      })(
        <Radio.Group
          style={{
            display: 'block',
          }}
        >
          <Table
            loading={loading}
            className="table-bank-accounts"
            rows={bankAccounts}
            columns={[
              {
                dataIndex: 'bank_name',
                key: 'bank_name',
                render: (value: any, row: any, index: any) => {
                  return row.iban ? row.iban.bank : '';
                },
                title: intl.formatMessage({
                  id: 'bank.table.bank_name',
                }),
              },
              {
                className: 'table-link',
                dataIndex: 'mandate',
                key: 'mandate',
                render: (value: any, row: any, index: any) => {
                  const mandate: IMandate | undefined =
                    row &&
                    row.mandates &&
                    row.mandates.find(
                      (currentMandate: IMandate) =>
                        currentMandate.status !== MandateStatus.Canceled,
                    );

                  return (
                    <Link
                      className={mandate ? 'disabled' : 'enabled'}
                      to={
                        mandate
                          ? `/company/bank/mandate/view/${row.id}`
                          : `/company/bank/mandate/add/${row.id}`
                      }
                    >
                      <FormattedMessage
                        id={`bank.table.mandate_${
                          mandate && mandate.status
                            ? mandate.status
                            : MandateStatus.Pending
                        }`.toLocaleLowerCase()}
                      />
                    </Link>
                  );
                },
                title: intl.formatMessage({
                  id: 'bank.table.mandate',
                }),
              },
              {
                align: 'center',
                dataIndex: 'label',
                key: 'label',
                render: (value: any, row: any, index: any) => {
                  return <Tag className="primary">{value}</Tag>;
                },
                title: intl.formatMessage({
                  id: 'bank.table.label',
                }),
              },
              {
                align: 'center',
                dataIndex: 'default',
                key: 'default',
                render: (value: any, row: any, index: any) => {
                  const mandate: IMandate | undefined =
                    row &&
                    row.mandates &&
                    row.mandates.find(
                      (currentMandate: IMandate) =>
                        currentMandate.status !== MandateStatus.Canceled,
                    );

                  return (
                    mandate && (
                      <Radio
                        onChange={onChangeDefaultBankAccount.bind(null, row.id)}
                        value={row.id}
                      />
                    )
                  );
                },
                title: intl.formatMessage({
                  id: 'bank.table.default',
                }),
              },
              {
                className: 'actions-bank-account',
                dataIndex: 'edit',
                key: 'edit',
                render: (value: any, row: any, index: any) => {
                  const mandate: IMandate | undefined =
                    row &&
                    row.mandates &&
                    row.mandates.find(
                      (currentMandate: IMandate) =>
                        currentMandate.status !== MandateStatus.Canceled,
                    );

                  return (
                    <Row type="flex">
                      <div className="edit-bank-account">
                        <Link to={`/company/bank/edit/${row.id}`}>
                          <Icon value={IconValue.Pencil} />
                        </Link>
                      </div>
                      {!mandate && (
                        <div
                          onClick={onRemove.bind(null, row.id)}
                          className="remove-bank-account"
                        >
                          <Icon value={IconValue.Trash} />
                        </div>
                      )}
                    </Row>
                  );
                },
                title: '',
              },
            ]}
          />
        </Radio.Group>,
      )}
      <Row
        type="flex"
        style={{
          justifyContent: 'flex-end',
          paddingTop: '36px',
        }}
      >
        <div className="ant-btn ant-btn-default">
          <Link to="/company/bank/add">
            <FormattedMessage id="bank.btn.add" />
          </Link>
        </div>
      </Row>
    </>
  );
};

// class Bank extends React.PureComponent<IProps, IState> {
//   remove = async (
//     id: string,
//     removeBankAccount?: (id: string) => Promise<IBankAccount | null>,
//   ) => {
//     if (removeBankAccount) {
//       await removeBankAccount(id);
//     }
//   };

//   render() {
//     const { getFieldDecorator } = form;

//     return (
//       <>
//         {getFieldDecorator('default-bank-account', {
//           initialValue: defaultBankAccount && defaultBankAccount.id,
//         })(
//           <Radio.Group
//             style={{
//               display: 'block',
//             }}
//           >
//             <Table
//               loading={loading}
//               className="table-bank-accounts"
//               rows={filtered}
//               columns={[
//                 {
//                   dataIndex: 'bank_name',
//                   key: 'bank_name',
//                   render: (value: any, row: any, index: any) => {
//                     return row.iban ? row.iban.bank : '';
//                   },
//                   title: intl.formatMessage({
//                     id: 'bank.table.bank_name',
//                   }),
//                 },
//                 {
//                   className: 'table-link',
//                   dataIndex: 'mandate',
//                   key: 'mandate',
//                   render: (value: any, row: any, index: any) => {
//                     const mandate: IMandate | undefined =
//                       row &&
//                       row.mandates &&
//                       row.mandates.find(
//                         (currentMandate: IMandate) =>
//                           currentMandate.status !==
//                           MandateStatus.Canceled,
//                       );

//                     return (
//                       <Link
//                         className={mandate ? 'disabled' : 'enabled'}
//                         to={
//                           mandate
//                             ? `/company/bank/mandate/view/${row.id}`
//                             : `/company/bank/mandate/add/${row.id}`
//                         }
//                       >
//                         <FormattedMessage
//                           id={`bank.table.mandate_${
//                             mandate && mandate.status
//                               ? mandate.status
//                               : MandateStatus.Pending
//                           }`.toLocaleLowerCase()}
//                         />
//                       </Link>
//                     );
//                   },
//                   title: intl.formatMessage({
//                     id: 'bank.table.mandate',
//                   }),
//                 },
//                 {
//                   align: 'center',
//                   dataIndex: 'label',
//                   key: 'label',
//                   render: (value: any, row: any, index: any) => {
//                     return <Tag className="primary">{value}</Tag>;
//                   },
//                   title: intl.formatMessage({
//                     id: 'bank.table.label',
//                   }),
//                 },
//                 {
//                   align: 'center',
//                   dataIndex: 'default',
//                   key: 'default',
//                   render: (value: any, row: any, index: any) => {
//                     const mandate: IMandate | undefined =
//                       row &&
//                       row.mandates &&
//                       row.mandates.find(
//                         (currentMandate: IMandate) =>
//                           currentMandate.status !==
//                           MandateStatus.Canceled,
//                       );

//                     return (
//                       mandate && (
//                         <Radio
//                           onChange={this.changeDefaultBank.bind(
//                             null,
//                             row.id,
//                             changeDefaultBankAccount,
//                           )}
//                           value={row.id}
//                         />
//                       )
//                     );
//                   },
//                   title: intl.formatMessage({
//                     id: 'bank.table.default',
//                   }),
//                 },
//                 {
//                   className: 'actions-bank-account',
//                   dataIndex: 'edit',
//                   key: 'edit',
//                   render: (value: any, row: any, index: any) => {
//                     const mandate: IMandate | undefined =
//                       row &&
//                       row.mandates &&
//                       row.mandates.find(
//                         (currentMandate: IMandate) =>
//                           currentMandate.status !==
//                           MandateStatus.Canceled,
//                       );

//                     return (
//                       <Row type="flex">
//                         <div className="edit-bank-account">
//                           <Link to={`/company/bank/edit/${row.id}`}>
//                             <Icon value={IconValue.Pencil} />
//                           </Link>
//                         </div>
//                         {!mandate && (
//                           <div
//                             onClick={this.remove.bind(
//                               null,
//                               row.id,
//                               removeBankAccount,
//                             )}
//                             className="remove-bank-account"
//                           >
//                             <Icon value={IconValue.Trash} />
//                           </div>
//                         )}
//                       </Row>
//                     );
//                   },
//                   title: '',
//                 },
//               ]}
//             />
//           </Radio.Group>,
//         )}
//         <Row
//           type="flex"
//           style={{
//             justifyContent: 'flex-end',
//             paddingTop: '36px',
//           }}
//         >
//           <div className="ant-btn ant-btn-default">
//             <Link to="/company/bank/add">
//               <FormattedMessage id="bank.btn.add" />
//             </Link>
//           </div>
//         </Row>
//     </>
//     );
//   }
// }

export default compose(
  injectIntl,
  Form.create({}),
  BankCtx.hoc(),
)(BankList);
