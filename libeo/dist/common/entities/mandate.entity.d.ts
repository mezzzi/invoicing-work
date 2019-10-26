import { Base } from './base.entity';
import { BankAccount } from './bank-account.entity';
import { User } from './user.entity';
export declare enum MandateStatus {
    PENDING = "PENDING",
    VALIDATED = "VALIDATED",
    SIGNED = "SIGNED",
    CANCELED = "CANCELED"
}
export declare class Mandate extends Base {
    bankAccount: BankAccount;
    treezorMandateId: string;
    rum: string;
    filePath: string;
    status: MandateStatus;
    signatory: User;
    signatoryIp: string;
    validationCode: string;
    signaturedAt: Date;
}
