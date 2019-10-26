import { BtnType, Button } from 'components/Button';
import { IInputAddress } from 'context/Addresses/types';
import {
  ICompany,
  ICompanyStatus,
  IInputCompany,
} from 'context/Company/types.d';
import * as React from 'react';
import { FormattedMessage } from 'react-intl';

interface IAutocompleteButtonResultProps {
  company: ICompany;
  onSelect?: (item: IInputCompany) => void;
  type: string;
}

export type PartialIAutocompleteButtonResultProps = Pick<
  IAutocompleteButtonResultProps,
  'onSelect' | 'type'
>;

const ButtonResult: React.FunctionComponent<IAutocompleteButtonResultProps> = ({
  onSelect,
  company,
  type,
}) => {
  const select = (selectedCompany: ICompany) => {
    const addresses: IInputAddress[] =
      selectedCompany.addresses && selectedCompany.addresses.rows
        ? selectedCompany.addresses.rows.map(address => {
            return {
              address1: address.address1,
              address2: address.address2,
              city: address.city,
              country: address.country,
              siret: address.siret,
              zipcode: address.zipcode,
            };
          })
        : [];

    const inputCompany: IInputCompany = {
      addresses,
      brandName: selectedCompany.brandName,
      capital: selectedCompany.capital,
      category: selectedCompany.category,
      domainName: selectedCompany.domainName,
      incorporationAt: selectedCompany.incorporationAt,
      legalForm: selectedCompany.legalForm,
      naf: selectedCompany.naf,
      nafNorm: selectedCompany.nafNorm,
      name: selectedCompany.name,
      numberEmployees: selectedCompany.numberEmployees,
      phone: selectedCompany.phone,
      siren: selectedCompany.siren,
      siret: selectedCompany.siret,
      slogan: selectedCompany.slogan,
      vatNumber: selectedCompany.vatNumber,
    };

    onSelect && onSelect(inputCompany);
  };

  let ButtonStatus: React.ReactElement<any> = (
    <Button onClick={select.bind(null, company)} type={BtnType.Default}>
      <FormattedMessage id="search.company.btn_add" />
    </Button>
  );

  if (type === 'invoices') {
    return (ButtonStatus = (
      <Button onClick={select.bind(null, company)} type={BtnType.Default}>
        {company.status === ICompanyStatus.already ? (
          <FormattedMessage id="search.company.btn_invoice_choose" />
        ) : (
          <FormattedMessage id="search.company.btn_invoice_add" />
        )}
      </Button>
    ));
  }
  switch (company.status) {
    case ICompanyStatus.self:
      if (type === 'companies' || type === 'partners') {
        ButtonStatus = (
          <Button disabled={true}>
            <FormattedMessage id="search.company.btn_self" />
          </Button>
        );
      }
      break;
    case ICompanyStatus.already:
      if (type === 'partners') {
        ButtonStatus = (
          <Button disabled={true}>
            <FormattedMessage id="search.company.btn_already" />
          </Button>
        );
      } else {
        ButtonStatus = (
          <Button disabled={true}>
            <FormattedMessage id="search.company.btn_exist" />
          </Button>
        );
      }
      break;
    case ICompanyStatus.exist:
      if (type === 'companies') {
        ButtonStatus = (
          <Button disabled={true}>
            <FormattedMessage id="search.company.btn_exist" />
          </Button>
        );
      }
      break;
    case ICompanyStatus.unknown:
      ButtonStatus = (
        <Button onClick={select.bind(null, company)} type={BtnType.Default}>
          <FormattedMessage id="search.company.btn_add" />
        </Button>
      );
      break;
  }

  return ButtonStatus;
};

export default ButtonResult;
