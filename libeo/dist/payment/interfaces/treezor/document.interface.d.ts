import { ITreezor, SortOrder } from './treezor.interface';
export declare enum DocumentStatus {
    PENDING = "PENDING",
    CANCELED = "CANCELED",
    VALIDATED = "VALIDATED"
}
export interface IDocumentParams extends ITreezor {
    documentId?: number;
    documentTag?: string;
    documentStatus?: DocumentStatus;
    documentTypeId?: number;
    documentType?: string;
    userId?: number;
    userName?: string;
    userEmail?: string;
    fileName?: string;
    fileSize?: number;
    fileType?: number;
    isAgent?: string;
    pageNumber?: number;
    pageCount?: number;
    sortBy?: string;
    sortOrder?: SortOrder;
    createdDateFrom?: Date;
    createdDateTo?: Date;
    updatedDateFrom?: Date;
    updatedDateTo?: Date;
}
export interface IDocuments {
    documents: IDocument[];
}
export interface IDocument {
    documentId: number;
    documentTag: string;
    documentStatus: DocumentStatus;
    documentTypeId: number;
    documentType: string;
    residenceId: number;
    clientId: number;
    userId: number;
    userLastname: string;
    userFirstname: string;
    fileName: string;
    temporaryUrl: string;
    temporaryUrlThumb: string;
    createdDate: Date;
    modifiedDate: Date;
    totalRows: number;
}
