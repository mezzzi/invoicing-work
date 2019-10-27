import { Invoice } from './invoice.entity';
import { User } from './user.entity';
import { Base } from './base.entity';
import { Payin } from './payin.entity';
export declare enum PaymentStatus {
    REQUESTED = "REQUESTED",
    BEING_PROCESSED = "BEING_PROCESSED",
    TREEZOR_PENDING = "TREEZOR_PENDING",
    TREEZOR_SYNC_KO_NOT_ENOUGH_BALANCE = "TREEZOR_SYNC_KO_NOT_ENOUGH_BALANCE",
    TREEZOR_SYNC_KO_MISC = "TREEZOR_SYNC_KO_MISC",
    TREEZOR_WH_KO_NOT_ENOUGH_BALANCE = "TREEZOR_WH_KO_NOT_ENOUGH_BALANCE",
    TREEZOR_WH_KO_MISC = "TREEZOR_WH_KO_MISC",
    TREEZOR_WH_VALIDATED = "TREEZOR_WH_VALIDATED",
    CANCELLED = "CANCELLED"
}
export declare const getStatusLibeoBalance: PaymentStatus[];
export declare class Payment extends Base {
    invoice: Invoice;
    status: PaymentStatus;
    amount: number;
    currency: string;
    libeoEstimatedBalance: number;
    paymentRequestUser: User;
    cancellationRequestAt: Date;
    cancellationRequestUser: User;
    paymentAt: Date;
    treezorRequestAt: Date;
    treezorPayoutId: number;
    treezorValidationAt: Date;
    treezorPayerWalletId: number;
    treezorBeneficiaryId: number;
    payin: Payin;
}
