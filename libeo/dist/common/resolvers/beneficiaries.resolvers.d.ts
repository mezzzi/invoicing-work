import { CompaniesService } from '../services/companies.service';
import { List } from '../interfaces/common.interface';
import { ITaxResidence } from '../../payment/interfaces/treezor/taxresidence.interface';
export declare class BeneficiariesResolvers {
    private readonly companiesService;
    constructor(companiesService: CompaniesService);
    createBeneficiary(ctx: any, input: any): Promise<any>;
    removeBeneficiary(ctx: any, id: number): Promise<any>;
    beneficiaries(ctx: any, limit: number, page: number): Promise<any>;
    taxResidence(userId: number, country: string): Promise<ITaxResidence>;
    documents(beneficiary: any, limit?: number, page?: number): Promise<List>;
}
