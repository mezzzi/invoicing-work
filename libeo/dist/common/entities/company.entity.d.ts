import { Address } from './address.entity';
import { Contact } from './contact.entity';
import { Partner } from './partner.entity';
import { User } from './user.entity';
import { Base } from './base.entity';
export declare enum CompanyStatus {
    SELF = "SELF",
    ALREADY = "ALREADY",
    EXIST = "EXIST",
    UNKNOWN = "UNKNOWN"
}
export declare enum CompanyKycStatus {
    PENDING = "PENDING",
    VALIDATED = "VALIDATED",
    REFUSED = "REFUSED"
}
export declare enum CompanyKycLevel {
    LIGHT = "LIGHT",
    REGULAR = "REGULAR",
    REFUSED = "REFUSED"
}
export declare enum CompanySource {
    ORIGINAL = "ORIGINAL",
    MANUAL = "MANUAL"
}
export declare enum CompanyCategory {
    PME = "PME",
    ETI = "ETI",
    GE = "GE"
}
export declare enum CompanyProvisionningStrategies {
    TOPUP = "TOPUP",
    AUTOLOAD = "AUTOLOAD"
}
export declare class Company extends Base {
    status: CompanyStatus;
    siren: string;
    siret: string;
    source: string;
    name: string;
    brandName: string;
    vatNumber: string;
    templatePreference: number;
    logoUrl: string;
    naf: string;
    nafNorm: string;
    numberEmployees: string;
    incorporationAt: Date;
    legalForm: string;
    category: string;
    slogan: string;
    domainName: string;
    capital: number;
    legalAnnualTurnOver: string;
    legalNetIncomeRange: string;
    phone: string;
    treezorEmail: string;
    treezorUserId: number;
    treezorWalletId: number;
    treezorIban: string;
    treezorBic: string;
    isFreezed: boolean;
    libeoEmail: string;
    addresses: Address[];
    contacts: Contact[];
    partners: Partner[];
    claimer: User;
    kycStatus: CompanyKycStatus;
    kycLevel: CompanyKycLevel;
    kycComment: string;
    kycStep: string;
    signature: any;
    provisionningStrategy: CompanyProvisionningStrategies;
    sddeRefusedCount: number;
    treezorKycLevel: string;
}
