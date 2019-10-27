import { Repository } from 'typeorm';
import { Payment, PaymentStatus } from '../entities/payment.entity';
import { Company } from '../entities/company.entity';
export declare class PaymentRepository extends Repository<Payment> {
    sumInvoicesByStatusAndDueAt(status: PaymentStatus[], paymentAt: Date, company: Company): Promise<number>;
    getDeferredPayments(): Promise<Payment[]>;
    getPlannedPayments(companyReceiver: Company, paymentAt?: Date): Promise<Payment[]>;
}
