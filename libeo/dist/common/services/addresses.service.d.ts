import { Address } from '../entities/address.entity';
import { Repository } from 'typeorm';
import { Company } from '../entities/company.entity';
import { CreateAddressDto } from '../dto/addresses.dto';
export declare class AddressesService {
    private readonly addressRepository;
    private readonly companyRepository;
    constructor(addressRepository: Repository<Address>, companyRepository: Repository<Company>);
    createOrUpdateAddress(currentCompany: Company, data: CreateAddressDto): Promise<Address>;
    removeAddress(company: Company, id: string): Promise<Address>;
    findByCompany(company: Company, orderBy?: string, limit?: number, offset?: number): Promise<Address[]>;
    countByCompany(company: Company): Promise<number>;
}
