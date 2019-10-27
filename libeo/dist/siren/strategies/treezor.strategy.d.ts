import { Strategy, Companies } from '../interfaces/strategy.interface';
import { TreezorService } from '../../payment/treezor.service';
export declare class TreezorStrategy implements Strategy {
    private readonly treezorService;
    readonly baseUrl: string;
    constructor(treezorService: TreezorService);
    private callApi;
    search(q: string, orderBy?: string, limit?: number, offset?: number): Promise<Companies>;
}
