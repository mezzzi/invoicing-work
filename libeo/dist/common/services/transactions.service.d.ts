import { List } from '../interfaces/common.interface';
import { TreezorService } from '../../payment/treezor.service';
import { Company } from '../entities/company.entity';
export declare class TransactionsService {
    private readonly treezorService;
    constructor(treezorService: TreezorService);
    findByCompany(company: Company, limit?: number, page?: number): Promise<List>;
}
