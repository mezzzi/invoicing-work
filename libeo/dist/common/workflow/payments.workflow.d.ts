import { TreezorService } from '../../payment/treezor.service';
import { Logger } from '@nestjs/common';
import { Payment } from '../entities/payment.entity';
import { Company } from '../entities/company.entity';
import { Repository } from 'typeorm';
import { BalancesService } from '../services/balances.service';
import { CompaniesService } from '../services/companies.service';
import { PayinsService } from '../services/payins.service';
import { ZendeskService } from '../../notification/zendesk.service';
export declare class PaymentsWorkflow {
    private readonly companyRepository;
    private readonly companiesService;
    private readonly balancesService;
    private readonly payinsService;
    private readonly treezorService;
    private readonly zendeskService;
    private readonly logger;
    constructor(companyRepository: Repository<Company>, companiesService: CompaniesService, balancesService: BalancesService, payinsService: PayinsService, treezorService: TreezorService, zendeskService: ZendeskService, logger: Logger);
    private sendToZendesk;
    processPayment: (payment: Payment) => Promise<void>;
    handlePaymentWithTopUp: (payment: Payment) => Promise<Payment>;
    handlePaymentWithAutoload: (payment: Payment) => Promise<void>;
}
