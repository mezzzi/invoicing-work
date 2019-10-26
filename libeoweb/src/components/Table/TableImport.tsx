import { Table } from 'antd';
import { IInvoice, InvoiceStatus } from 'context/Invoice/types';
import * as Upload from 'context/Upload';
import * as React from 'react';
import { compose } from 'react-apollo';
import { InjectedIntlProps, injectIntl } from 'react-intl';
import './Table.module.less';

interface IProps extends InjectedIntlProps, Upload.InjectedProps {
  empty?: React.ReactNode;
  dataSource: any;
  selectable?: boolean;
  columns: any;
  selectedId?: string;
  onSelectRows?: (invoices: IInvoice[]) => void;
  onClickRow?: (invoice: IInvoice) => void;
  onClickHeader?: (event: any) => void;
  onChangePage(current?: number, pageSize?: number): any;
}

interface IState {
  selectedRowKeys: string[];
}

class TableImport extends React.PureComponent<IProps, IState> {
  state = {
    selectedRowKeys: [],
  };

  handleRow: (record: any, rowIndex: number) => void;
  handleHeaderRow: (event: any) => void;
  handleRowClassName: (record: any, index: number) => string;
  handlSelectedRowKeysChange: (selectedRowKeys: any) => void;

  constructor(props: any) {
    super(props);

    this.handleRow = this.row.bind(this);
    this.handleHeaderRow = this.headerRow.bind(this);
    this.handleRowClassName = this.rowClassName.bind(this);
    this.handlSelectedRowKeysChange = this.selectedRowKeysChange.bind(this);
  }

  row(record: any, rowIndex: number) {
    const { dataSource, onClickRow } = this.props;
    return {
      onClick: () => {
        onClickRow && onClickRow(dataSource[rowIndex] as IInvoice);
      },
    };
  }

  headerRow(event: any) {
    this.props.onClickHeader && this.props.onClickHeader(event);
  }

  selectedRowKeysChange(selectedRowKeys: any) {
    const invoices: IInvoice[] = [];
    this.props.dataSource.map((invoice: IInvoice) =>
      selectedRowKeys.indexOf(invoice.id) > -1 ? invoices.push(invoice) : null,
    );
    this.props.onSelectRows && this.props.onSelectRows(invoices);
    this.setState({ selectedRowKeys });
  }

  rowClassName(record: any, index: number) {
    let className = '';
    switch (record.status) {
      case InvoiceStatus.Scanning:
        className = 'tr-invoice-loading';
        break;
      case InvoiceStatus.Importing:
        className = 'tr-invoice-loading';
        break;
      case InvoiceStatus.Imported:
        className = 'tr-invoice-loading';
        break;
      default:
        className = 'tr-invoice';
        break;
    }

    if (
      record.id &&
      this.props.selectedId &&
      record.id === this.props.selectedId
    ) {
      className = `${className} ant-table-row-selected`;
    }

    return className;
  }

  render() {
    const { dataSource, selectable, columns, intl, empty } = this.props;
    const { selectedRowKeys } = this.state;

    return (
      <div className="table-invoices">
        {dataSource && dataSource.length > 0 ? (
          <Table
            pagination={false}
            onRow={this.handleRow}
            rowSelection={
              selectable
                ? {
                    onChange: this.handlSelectedRowKeysChange,
                    selectedRowKeys,
                  }
                : undefined
            }
            rowKey="id"
            bordered={false}
            rowClassName={this.handleRowClassName}
            dataSource={dataSource}
            columns={columns}
          />
        ) : (
          empty
        )}
      </div>
    );
  }
}

export default compose(
  injectIntl,
  Upload.hoc(),
)(TableImport);
