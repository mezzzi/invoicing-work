import { Invoice, InvoiceStatus } from '../entities/invoice.entity';
import { InvoicesService } from '../services/invoices.service';
import { List } from '../interfaces/common.interface';
import { HistoriesService } from '../services/histories.service';
import { PaymentsService } from '../services/payments.service';
export declare class InvoicesResolvers {
    private readonly invoicesService;
    private readonly paymentsService;
    private readonly historiesService;
    constructor(invoicesService: InvoicesService, paymentsService: PaymentsService, historiesService: HistoriesService);
    createInvoice(ctx: any, input: any): Promise<Invoice>;
    updateInvoice(ctx: any, id: string, input: any): Promise<Invoice>;
    updateInvoiceStatus(ctx: any, id: string, status: InvoiceStatus): Promise<Invoice>;
    removeInvoice(ctx: any, id: string): Promise<Invoice>;
    generateCode(ctx: any, invoiceId: string): Promise<Invoice>;
    invoices(ctx: any, filters?: any, orderBy?: string, limit?: number, offset?: number): Promise<List>;
    invoice(ctx: any, id: string): Promise<Invoice>;
    history(invoice: Invoice, orderBy?: string, limit?: number, offset?: number): Promise<List>;
}
