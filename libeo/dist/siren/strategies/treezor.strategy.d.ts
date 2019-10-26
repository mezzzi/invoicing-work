import { Strategy, Companies } from '../interfaces/strategy.interface';
import { Utils } from '../utils.service';
export declare class TreezorStrategy extends Utils implements Strategy {
    readonly baseUrl: string;
    private callApi;
    search(q: string, orderBy?: string, limit?: number, offset?: number): Promise<Companies>;
}
