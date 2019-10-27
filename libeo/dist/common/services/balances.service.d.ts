import { TreezorService } from '../../payment/treezor.service';
import { Company } from '../entities/company.entity';
import { InvoicesService } from './invoices.service';
import { PaymentRepository } from '../repositories/payment.repository';
import { Payment } from '../entities/payment.entity';
import { IBalance } from '../../payment/interfaces/treezor/balance.interface';
export declare class BalancesService {
    private readonly invoicesService;
    private readonly paymentRepository;
    private readonly treezorService;
    constructor(invoicesService: InvoicesService, paymentRepository: PaymentRepository, treezorService: TreezorService);
    getBalance(company: Company): Promise<IBalance>;
    calculationLibeoBalance(balance: IBalance, paymentAt: Date, company: Company): Promise<number>;
    checkBalance(balance: IBalance, company: Company, invoiceId: string, paymentAt?: Date): Promise<boolean>;
    updateLibeoBalance(company: Company, currentPayment?: Payment): Promise<void>;
}
