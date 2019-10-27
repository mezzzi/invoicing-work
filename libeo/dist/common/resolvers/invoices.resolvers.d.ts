import { Invoice, InvoiceStatus } from '../entities/invoice.entity';
import { InvoicesService } from '../services/invoices.service';
import { List } from '../interfaces/common.interface';
import { HistoriesService } from '../services/histories.service';
import { PaymentsService } from '../services/payments.service';
import { File } from '../interfaces/file.interface';
export declare class InvoicesResolvers {
    private readonly invoicesService;
    private readonly paymentsService;
    private readonly historiesService;
    constructor(invoicesService: InvoicesService, paymentsService: PaymentsService, historiesService: HistoriesService);
    uploadRib(file: File, invoiceId: string): Promise<string>;
    createInvoice(ctx: any, input: any): Promise<Invoice>;
    createOrUpdateAR(ctx: any, id: string, input: any): Promise<Invoice>;
    updateInvoice(ctx: any, id: string, input: any): Promise<Invoice>;
    updateInvoiceStatus(ctx: any, id: string, status: InvoiceStatus): Promise<Invoice[]>;
    removeInvoice(ctx: any, id: string): Promise<Invoice>;
    removeAll(input?: boolean): Promise<Boolean>;
    generateCode(ctx: any, invoiceId: string): Promise<Invoice>;
    invoices(ctx: any, filters?: any, orderBy?: string, limit?: number, offset?: number): Promise<List>;
    emittedInvoices(ctx: any, filters?: any, orderBy?: string, limit?: number, offset?: number): Promise<List>;
    invoice(ctx: any, id: string): Promise<Invoice>;
    emittedInvoice(ctx: any, id: string): Promise<Invoice>;
    estimatedBalance(invoice: Invoice): Promise<number | null>;
    paymentAt(invoice: Invoice): Promise<Date | null>;
    history(invoice: Invoice, orderBy?: string, limit?: number, offset?: number): Promise<List>;
}
