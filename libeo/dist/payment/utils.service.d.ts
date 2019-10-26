import { ITreezorConfig } from './interfaces/treezor/config.interface';
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
export declare class Utils {
    private readonly config;
    private readonly defaultOptions;
    private readonly webhook;
    constructor(config: ITreezorConfig);
    private resetOptions;
    private setGlobalProperties;
    private setMutationCallOptions;
    private getSignature;
    mutation(endpoint: string, options: MutationOptions): Promise<any>;
    query(endpoint: string, options: QueryOptions): Promise<any>;
}
