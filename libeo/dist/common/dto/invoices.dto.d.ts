/// <reference types="node" />
import * as fs from 'fs';
import { Company } from '../entities/company.entity';
interface File {
    createReadStream: fs.ReadStream;
    filename: string;
    mimetype: string;
    encoding: string;
}
export declare class CreateInvoiceDto {
    file: File;
}
export declare class UpdateInvoiceDto {
    receiverTitle: string;
    number: string;
    currency: string;
    total: number;
    totalWoT: number;
    dueDate: Date;
    invoiceDate: Date;
    companyEmitter: Company;
}
export {};
