import { Base } from './base.entity';
import { Company } from './company.entity';
declare enum PayinType {
    SDDE = "SDDE"
}
export declare enum PayinStatus {
    PENDING = "PENDING",
    VALIDATED = "VALIDATED",
    CANCELLED = "CANCELLED"
}
export declare class Payin extends Base {
    company: Company;
    amount: number;
    currency: string;
    type: PayinType;
    status: PayinStatus;
    payinAt: Date;
    treezorPayinId: number;
    treezorCreatedAt: Date;
    treezorValidationAt: Date;
    treezorFundReceptionAt: Date;
    treezorWalletId: number;
    treezorResponse: string;
}
export {};
