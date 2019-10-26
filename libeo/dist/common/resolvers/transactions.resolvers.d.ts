import { List } from '../interfaces/common.interface';
import { TransactionsService } from '../services/transactions.service';
export declare class TransactionsResolver {
    private readonly transactionsService;
    constructor(transactionsService: TransactionsService);
    transactions(ctx: any, limit?: number, page?: number): Promise<List>;
}
