import { List } from '../interfaces/common.interface';
import { Company } from '../entities/company.entity';
export declare class TransactionsService {
    findByCompany(company: Company, limit?: number, page?: number): Promise<List>;
}
