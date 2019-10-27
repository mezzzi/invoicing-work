import { Strategy, Companies } from '../interfaces/strategy.interface';
import { ConfigService } from 'nestjs-config';
export declare class SirenStrategy implements Strategy {
    constructor(config: ConfigService);
    readonly baseUrl: string;
    readonly endpoint: string;
    private bearerToken;
    private readonly basicToken;
    private serialize;
    private refreshToken;
    search(query: string, orderBy?: string, limit?: number, offset?: number): Promise<Companies>;
}
