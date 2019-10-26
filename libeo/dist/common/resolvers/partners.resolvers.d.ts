import { PartnersService } from '../services/partners.service';
import { CompaniesService } from '../services/companies.service';
import { Company } from '../entities/company.entity';
export declare class PartnersResolvers {
    private readonly partnersService;
    private readonly companiesService;
    constructor(partnersService: PartnersService, companiesService: CompaniesService);
    createPartner(input: Company, ctx: any): Promise<Company>;
    partners(ctx: any, limit: number, offset: number): Promise<any>;
    partner(id: string): Promise<Company>;
}
