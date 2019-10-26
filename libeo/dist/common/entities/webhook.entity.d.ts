import { BaseEntity } from 'typeorm';
export declare class Webhook extends BaseEntity {
    id: string;
    accessTag: string;
    requestPayload: any;
    responsePayload: any;
    webhook: string;
    webhookId: number;
    object: string;
    objectId: number;
    objectPayload: any;
    objectPayloadSignature: string;
    createdAt: Date;
    updatedAt: Date;
}
