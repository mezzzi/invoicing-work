import { Company } from '../entities/company.entity';
import { InvoicesService } from './invoices.service';
import { PaymentRepository } from '../repositories/payment.repository';
import { IBalance } from '../../payment/interfaces/treezor/balance.interface';
export declare class BalancesService {
    private readonly invoicesService;
    private readonly paymentRepository;
    constructor(invoicesService: InvoicesService, paymentRepository: PaymentRepository);
    getBalance(company: Company): Promise<IBalance>;
    calculationLibeoBalance(balance: IBalance, paymentAt: Date, company: Company): Promise<number>;
    checkBalance(balance: IBalance, company: Company, invoiceId: string, paymentAt?: Date): Promise<boolean>;
}
