import { IbansService } from '../services/ibans.service';
import { IbanStatus } from '../entities/iban.entity';
import { List } from '../interfaces/common.interface';
export declare class IbansResolvers {
    private readonly ibansService;
    constructor(ibansService: IbansService);
    checkIban(iban: string): Promise<IbanStatus>;
    ibans(siren: string): Promise<List>;
}
