import { Tag } from 'antd';
import CompanyAvatar from 'components/Avatar/CompanyAvatar';
import Infinity from 'components/Infinity';
import { ICompany, ICompanyStatus } from 'context/Company/types.d';
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import Button, { PartialIAutocompleteButtonResultProps } from './Button';
import NotFound from './NotFound';

export interface IAutocompleteResultProps
  extends PartialIAutocompleteButtonResultProps {
  clickFooter: () => void;
  footer?: React.ReactNode;
  loadMore?: (more: any) => Promise<void>;
  value: string;
  open: boolean;
  rows?: ICompany[];
  hasMore?: boolean;
  loading?: boolean;
}

export type PartialIAutocompleteResultProps = Pick<
  IAutocompleteResultProps,
  'hasMore' | 'loading' | 'rows' | 'loadMore' | 'footer'
>;

const Results: React.FunctionComponent<IAutocompleteResultProps> = ({
  footer,
  loadMore,
  rows,
  hasMore,
  loading,
  open,
  clickFooter,
  value,
  ...rest
}) => {
  let dataSource: any = [];
  if (!loading && rows && rows.length > 0) {
    dataSource = rows.map((item: ICompany, i: number) => {
      if (!item) {
        return null;
      }
      let concatenedAddress: string | null = null;
      if (
        item &&
        item.addresses &&
        item.addresses.rows &&
        item.addresses.rows[0]
      ) {
        const address = item.addresses.rows[0];
        concatenedAddress = `${address.address1 ? `${address.address1} ` : ''}${
          address.zipcode ? `${address.zipcode} ` : ''
        }${address.city ? `${address.city} ` : ''}${
          address.country ? `${address.country}` : ''
        }`;
      }

      return (
        <div className="search-result-item" key={`${i}`}>
          <div className="option-avatar">
            <CompanyAvatar company={item} />
          </div>
          <div className="option-info">
            <div className="company-title">{item.name || item.brandName}</div>
            {concatenedAddress && (
              <div className="company-address">{concatenedAddress}</div>
            )}
            <div className="company-siret">
              <FormattedMessage id="search.company.siret" />: {item.siret}
            </div>
            <div>
              {item.status === ICompanyStatus.already && (
                <Tag
                  style={{
                    marginTop: 5,
                  }}
                >
                  <FormattedMessage id="search.company.tag_partner" />
                </Tag>
              )}
            </div>
          </div>
          <div className="option-cta">
            <Button {...rest} company={item} />
          </div>
        </div>
      );
    });
  } else if (
    !loading &&
    rows &&
    rows.length === 0 &&
    value &&
    value.length > 0
  ) {
    dataSource = [
      <div key="0" className="search-result-item">
        <NotFound />
      </div>,
    ];
  }

  return dataSource.length > 0 && open ? (
    <div className="search-result-outer">
      <div className="search-result">
        <Infinity hasMore={hasMore} loadMore={loadMore} useWindow={false}>
          {dataSource}
        </Infinity>
      </div>
      {footer && (
        <div onClick={clickFooter} className="search-result-footer">
          {footer}
        </div>
      )}
    </div>
  ) : null;
};

export default Results;
