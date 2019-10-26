import { Repository } from 'typeorm';
import { ParsedMailDto } from '../dto/inbound_email.dto';
import { InvoicesService } from '../services/invoices.service';
import { UsersService } from '../services/users.service';
import { WebhooksService } from '../services/webhooks.service';
import { CompaniesService } from '../services/companies.service';
import { PaymentsService } from '../services/payments.service';
import { Company } from '../entities/company.entity';
import { PaymentRepository } from '../repositories/payment.repository';
export declare class SendgridController {
    private readonly companyRepository;
    private readonly paymentRepository;
    private readonly webhooksService;
    private readonly paymentsService;
    private readonly companiesService;
    private readonly invoicesService;
    private readonly usersService;
    constructor(companyRepository: Repository<Company>, paymentRepository: PaymentRepository, webhooksService: WebhooksService, paymentsService: PaymentsService, companiesService: CompaniesService, invoicesService: InvoicesService, usersService: UsersService);
    newIncomingEmail(files: any, MyBody: ParsedMailDto, req: any): Promise<string>;
}
