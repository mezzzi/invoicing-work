import { Repository } from 'typeorm';
import { Webhook } from '../common/entities/webhook.entity';
import { ConfigService } from 'nestjs-config';
export declare enum MutationMethod {
    POST = "POST",
    PUT = "PUT",
    DELETE = "DELETE"
}
export interface MutationOptions {
    body?: any;
    form?: any;
    formData?: any;
    method?: MutationMethod;
    objectIdKey?: string;
    sign?: boolean;
}
export interface QueryOptions {
    qs?: any;
    sign?: boolean;
}
export declare class TreezorAPI {
    private readonly config;
    private readonly defaultOptions;
    private readonly webhook;
    constructor(webhookRepository: Repository<Webhook>, configService: ConfigService);
    private resetOptions;
    private setGlobalProperties;
    private setMutationCallOptions;
    computePayloadSignature(value: any): string;
    mutation(endpoint: string, options: MutationOptions): Promise<any>;
    query(endpoint: string, options: QueryOptions): Promise<any>;
}
