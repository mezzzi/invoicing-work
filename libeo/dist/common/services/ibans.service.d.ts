import { Iban } from '../entities/iban.entity';
import { Repository } from 'typeorm';
import { IValidateIban } from '../interfaces/iban.interface';
import { Invoice } from '../entities/invoice.entity';
import { User } from '../entities/user.entity';
import { List } from '../interfaces/common.interface';
import { Company } from '../entities/company.entity';
export declare class IbansService {
    private readonly ibanRepository;
    private readonly companyRepository;
    constructor(ibanRepository: Repository<Iban>, companyRepository: Repository<Company>);
    private snakeToCamel;
    createIban(data: IValidateIban, invoice: Invoice, user?: User): Promise<Iban>;
    createIbanBankAccount(data: IValidateIban, user: User, company?: Company): Promise<Iban>;
    getApiValidateIban(iban: string): Promise<IValidateIban>;
    checkIban(iban: string): Promise<any>;
    findOneByIbanAndCompany(iban: string, company: Company): Promise<Iban>;
    findByCompany(company: Company): Promise<List>;
    findByCompanySiren(siren: string): Promise<List>;
}
