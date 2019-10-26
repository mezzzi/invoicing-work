import { MandatesService } from '../services/mandates.service';
import { Mandate } from '../entities/mandate.entity';
export declare class MandatesResolvers {
    private readonly mandatesService;
    constructor(mandatesService: MandatesService);
    createMandate(ctx: any, bankAccountId: string): Promise<Mandate>;
    generateCodeMandate(ctx: any, id: string): Promise<Mandate>;
    signedMandate(ctx: any, id: string, code: string): Promise<Mandate>;
    removeMandate(ctx: any, id: string): Promise<Mandate>;
    mandate(ctx: any, id: string): Promise<Mandate>;
}
