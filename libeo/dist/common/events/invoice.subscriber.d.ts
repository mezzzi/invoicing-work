import { EntitySubscriberInterface, UpdateEvent } from 'typeorm';
import { Invoice } from '../entities/invoice.entity';
export declare class InvoiceSubscriber implements EntitySubscriberInterface<Invoice> {
    private checkStatusChange;
    private createHistory;
    private cancelPayments;
    private accountingEntry;
    listenTo(): typeof Invoice;
    beforeUpdate(event: UpdateEvent<Invoice>): void;
    afterUpdate(event: UpdateEvent<Invoice>): Promise<void>;
}
