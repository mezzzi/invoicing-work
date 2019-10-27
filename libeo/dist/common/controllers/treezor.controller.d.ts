import { Repository } from 'typeorm';
import { PaymentsService } from '../services/payments.service';
import { Company } from '../entities/company.entity';
import { Webhook } from '../entities/webhook.entity';
import { TreezorService } from '../../payment/treezor.service';
import { BankAccountService } from '../services/bank-account.service';
import { Payin } from '../entities/payin.entity';
import { ZendeskService } from '../../notification/zendesk.service';
import { TreezorPayoutWorkflow } from '../workflow/treezor-payout.workflow';
export declare class TreezorController {
    private readonly companyRepository;
    private readonly payinRepository;
    private readonly paymentsService;
    private readonly bankAccountService;
    private readonly treezorService;
    private readonly zendeskService;
    private readonly treezorPayoutWorkflow;
    constructor(companyRepository: Repository<Company>, payinRepository: Repository<Payin>, paymentsService: PaymentsService, bankAccountService: BankAccountService, treezorService: TreezorService, zendeskService: ZendeskService, treezorPayoutWorkflow: TreezorPayoutWorkflow);
    webhook(res: any, webhook: Webhook): Promise<void>;
}
