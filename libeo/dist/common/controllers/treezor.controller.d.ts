import { Repository } from 'typeorm';
import { IWebhook } from '../interfaces/webhook.interface';
import { WebhooksService } from '../services/webhooks.service';
import { PaymentsService } from '../services/payments.service';
import { Company } from '../entities/company.entity';
import { PaymentRepository } from '../repositories/payment.repository';
import { BankAccountService } from '../services/bank-account.service';
export declare class TreezorController {
    private readonly companyRepository;
    private readonly paymentRepository;
    private readonly webhooksService;
    private readonly paymentsService;
    private readonly bankAccountService;
    constructor(companyRepository: Repository<Company>, paymentRepository: PaymentRepository, webhooksService: WebhooksService, paymentsService: PaymentsService, bankAccountService: BankAccountService);
    webhook(res: any, body: IWebhook): Promise<void>;
}
