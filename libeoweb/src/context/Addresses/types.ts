export interface IAddress {
  id: string;
  siret?: string;
  zipcode: number;
  city: string;
  country: string;
  address1?: string;
  address2?: string;
}

export interface IInputAddress {
  id?: string;
  siret?: string;
  zipcode: number;
  city: string;
  country: string;
  companyId?: string;
  address1?: string;
  address2?: string;
}
