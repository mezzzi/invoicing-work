import { Repository } from 'typeorm';
import { History } from '../entities/history.entity';
import { CreateHistoryDto } from '../dto/histories.dto';
import { List } from '../interfaces/common.interface';
export declare class HistoriesService {
    private readonly historyRepository;
    constructor(historyRepository: Repository<History>);
    createHistory(data: CreateHistoryDto): Promise<History>;
    findByInvoiceId(id: string, orderBy?: string, limit?: number, offset?: number): Promise<List>;
}
