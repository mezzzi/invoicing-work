import { PaymentsService } from '../services/payments.service';
import { Invoice } from '../entities/invoice.entity';
export declare class PaymentsResolvers {
    private readonly paymentsService;
    constructor(paymentsService: PaymentsService);
    payout(ctx: any, invoiceId: string, date?: Date, code?: string): Promise<Invoice[]>;
    payoutContacts(ctx: any, invoiceId: string, contactIds: string[]): Promise<boolean>;
}
