import { CompaniesService } from '../services/companies.service';
import { Company, CompanyStatus, CompanyKycStatus } from '../entities/company.entity';
import { AddressesService } from '../services/addresses.service';
import { ContactsService } from '../services/contacts.service';
import { List } from '../interfaces/common.interface';
import { IDocument } from '../../payment/interfaces/treezor/document.interface';
import { InvoicesService } from '../services/invoices.service';
import { IComplementaryInfos } from '../interfaces/company.interface';
import { IbansService } from '../services/ibans.service';
export declare class CompaniesResolvers {
    private readonly companiesService;
    private readonly addressesService;
    private readonly contactsService;
    private readonly invoicesService;
    private readonly ibansService;
    constructor(companiesService: CompaniesService, addressesService: AddressesService, contactsService: ContactsService, invoicesService: InvoicesService, ibansService: IbansService);
    createOrUpdateCompany(ctx: any, id: string, input: Company): Promise<Company>;
    signContract(ctx: any): Promise<boolean>;
    updateKycStatus(ctx: any, status: CompanyKycStatus): Promise<Company>;
    removeDocument(id: number): Promise<IDocument>;
    updateKycStep(ctx: any, step: string): Promise<Company>;
    searchCompanies(query: string, orderBy?: string, limit?: number, offset?: number): Promise<List>;
    company(ctx: any): Promise<Company>;
    contract(ctx: any): Promise<string>;
    representatives(ctx: any): Promise<any>;
    companyWithComplementaryInfos(siren: string): Promise<IComplementaryInfos>;
    status(ctx: any, company: Company): Promise<CompanyStatus>;
    addresses(company: Company, orderBy?: string, limit?: number, offset?: number): Promise<any>;
    contacts(ctx: any, company: Company, orderBy?: string, limit?: number, offset?: number): Promise<List>;
    invoicesSent(ctx: any, company: Company): Promise<number>;
    invoicesReceived(ctx: any, company: Company): Promise<number>;
    ibans(company: Company): Promise<List>;
}
