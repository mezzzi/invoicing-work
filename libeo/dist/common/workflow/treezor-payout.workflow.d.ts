import { PaymentRepository } from '../repositories/payment.repository';
import { Company } from '../entities/company.entity';
import { Repository } from 'typeorm';
import { ZendeskService } from '../../notification/zendesk.service';
import { IPayout } from '../../payment/interfaces/treezor/payout.interface';
import { Logger } from '@nestjs/common';
export declare class TreezorPayoutWorkflow {
    private readonly companyRepository;
    private readonly paymentRepository;
    private readonly zendeskService;
    private readonly logger;
    constructor(companyRepository: Repository<Company>, paymentRepository: PaymentRepository, zendeskService: ZendeskService, logger: Logger);
    handlePayout: (payout: IPayout) => Promise<void>;
}
