import { BalancesService } from '../services/balances.service';
export declare class BalancesResolver {
    private readonly balancesService;
    constructor(balancesService: BalancesService);
    balance(ctx: any): Promise<any>;
    checkBalance(ctx: any, invoiceId: string, paymentAt?: Date): Promise<boolean>;
}
