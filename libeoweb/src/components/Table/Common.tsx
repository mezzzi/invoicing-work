import { Row, Table } from 'antd';
import { IInvoice } from 'context/Invoice/types';
import * as React from 'react';
import { InjectedIntlProps, injectIntl } from 'react-intl';

interface IProps extends InjectedIntlProps {
  loading?: boolean;
  rows?: any[];
  selectable?: boolean;
  className?: string;
  columns: any[];
  loadMore?: (more: any) => Promise<void>;
  onClickRow?: (invoice: IInvoice) => void;
}

interface IState {
  limit?: number;
  offset?: number;
}

class Common extends React.PureComponent<IProps, IState> {
  static defaultProps = {};

  state = {
    limit: 8,
    offset: 0,
  };

  render() {
    const { className, rows, loading, columns } = this.props;

    return (
      <Row
        style={{
          width: '100%',
        }}
      >
        {rows && rows.length > 0 && (
          <Table
            key="table"
            className={className}
            pagination={false}
            rowKey="id"
            bordered={false}
            dataSource={rows}
            columns={columns}
          />
        )}
      </Row>
    );
  }
}

export default injectIntl(Common);
