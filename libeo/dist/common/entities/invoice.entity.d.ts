import { BaseEntity } from 'typeorm';
import { Company } from './company.entity';
import { User } from './user.entity';
import { Iban } from './iban.entity';
import { AccountingPreference } from './accounting-preference.entity';
export declare enum InvoiceStatus {
    IMPORTING = "IMPORTING",
    IMPORTED = "IMPORTED",
    SCANNING = "SCANNING",
    SCANNED = "SCANNED",
    TO_PAY = "TO_PAY",
    PLANNED = "PLANNED",
    AR_DRAFT = "AR_DRAFT",
    PAID = "PAID"
}
export declare enum InvoiceExtension {
    JPG = "image/jpg",
    JPEG = "image/jpeg",
    GIF = "image/gif",
    PNG = "image/png",
    BMP = "image/bmp",
    PDF = "application/pdf"
}
export declare class Invoice extends BaseEntity {
    id: string;
    companyEmitter: Company;
    companyReceiver: Company;
    importedBy: User;
    status: InvoiceStatus;
    receiverTitle: string | null;
    emitterTitle: string | null;
    number: string | null;
    filepath: string | null;
    filename: string | null;
    iban: Iban;
    currency: string;
    total: number;
    totalWoT: number;
    importAt: Date;
    dueDate: Date;
    invoiceDate: Date;
    vatAmounts: any;
    enabled: boolean;
    error: boolean;
    ocrStatus: string;
    ocrPartner: string;
    ocrSirenFeedback: any;
    ocrFeedback: any;
    code: string;
    codeValidatedBy: User;
    codeValidatedAt: Date;
    purchaseAccount: AccountingPreference;
    createdAt: Date;
    updatedAt: Date;
    companyEmitterId: string;
    companyEmitterDetails: any;
    companyEmitterContactDetails: any;
    companyReceiverId: string;
    companyReceiverDetails: any;
    documentType: string;
    invoiceDescription: string;
    discount: number;
    templateId: number;
    displayLegalNotice: any;
    products: any;
    arCreatedById: string;
    source: string;
}
