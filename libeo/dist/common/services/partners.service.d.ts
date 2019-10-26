import { Repository } from 'typeorm';
import { Partner } from '../entities/partner.entity';
import { Company } from '../entities/company.entity';
import { CompaniesService } from './companies.service';
import { User } from '../entities/user.entity';
export declare class PartnersService {
    private readonly partnerRepository;
    private readonly companyRepository;
    private readonly companiesService;
    constructor(partnerRepository: Repository<Partner>, companyRepository: Repository<Company>, companiesService: CompaniesService);
    createPartner(user: User, data: Company): Promise<Company>;
    findOneByCompanyInitiatorIdAndCompanyPartnerId(companyInitiatorId: string, companyPartnerId: string): Promise<Partner>;
    findByCompany(company: Company, orderBy?: string, limit?: number, offset?: number): Promise<Company[]>;
    countByCompany(company: Company): Promise<number>;
    findOneById(id: string): Promise<Company>;
}
