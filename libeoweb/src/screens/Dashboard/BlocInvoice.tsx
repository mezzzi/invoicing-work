import { IconValue } from 'components/Assets/Icon';
import { CondensedCard } from 'components/Card';
import { InvoiceStatus } from 'context/Invoice/types';
import * as Invoices from 'context/Invoices';
import * as React from 'react';
import { Link } from 'react-router-dom';

interface IProps {
  status: InvoiceStatus[];
  color?: string;
  icon: IconValue;
  to: string;
  style?: React.CSSProperties;
  description: string;
  loading?: boolean;
}

const BlocInvoice: React.FunctionComponent<IProps> = ({
  status,
  description,
  color,
  loading,
  to,
  style,
  icon,
}) => {
  return (
    <Invoices.Provider offset={0} limit={1} count={status}>
      <Invoices.Consumer>
        {data => {
          const count =
            data.invoices &&
            data.invoices.count &&
            data.invoices.count.invoices;

          let loadingInvoices = false;
          if (!data.invoices) {
            loadingInvoices = true;
          } else if (data.invoices && data.invoices.loading) {
            loadingInvoices = true;
          }

          return (
            <Link to={to}>
              <CondensedCard
                style={style}
                loading={loading || loadingInvoices}
                center={false}
                className="bloc-invoice-count"
                color={color}
                title={count ? count.total : ''}
                description={description}
                icon={icon}
              />
            </Link>
          );
        }}
      </Invoices.Consumer>
    </Invoices.Provider>
  );
};

export default BlocInvoice;
