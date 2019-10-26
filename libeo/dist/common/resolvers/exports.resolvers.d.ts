import { ExportsService } from '../services/exports.service';
import { List } from '../interfaces/common.interface';
export declare class ExportsResolvers {
    private readonly exportsService;
    constructor(exportsService: ExportsService);
    export(ctx: any): Promise<string>;
    exports(ctx: any, orderBy?: string, limit?: number, offset?: number): Promise<List>;
}
