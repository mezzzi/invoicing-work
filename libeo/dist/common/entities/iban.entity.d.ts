import { BaseEntity } from 'typeorm';
import { User } from './user.entity';
import { Company } from './company.entity';
export declare enum IbanStatus {
    PASSED = "passed",
    FAILED = "failed",
    BLACKLIST = "blacklist",
    FAKE = "fake"
}
export declare class Iban extends BaseEntity {
    id: string;
    iban: string;
    readerCompany: Company;
    treezorBeneficiaryId: number;
    createdBy: User;
    company: Company;
    result: string;
    returnCode: number;
    bic: string;
    bicCondidates: any;
    country: string;
    bankCode: string;
    bank: string;
    bankAddress: string;
    branch: string;
    branchCode: string;
    inSclDirectory: string;
    sct: string;
    sdd: string;
    cor1: string;
    b2b: string;
    scc: string;
    jsonIbanBic: any;
    createdAt: Date;
    updatedAt: Date;
}
