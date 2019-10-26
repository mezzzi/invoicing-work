import { CreateAddressDto } from './addresses.dto';
export declare class CreateOrUpdateCompanyDto {
    siren?: string;
    siret?: string;
    name?: string;
    brandName?: string;
    slogan?: string;
    domainName?: string;
    naf?: string;
    nafNorm?: string;
    numberEmployees?: string;
    legalForm?: string;
    category?: string;
    incorporationAt?: Date;
    vatNumber?: string;
    addresses?: CreateAddressDto[];
}
