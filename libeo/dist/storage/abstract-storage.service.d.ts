import { File } from '../common/interfaces/file.interface';
import { StorageServiceInterface } from './storage-strategy.interface';
import { Logger } from '@nestjs/common';
export declare class AbstractStorageService implements StorageServiceInterface {
    readonly logger: Logger;
    constructor(logger: Logger);
    uploadImplementation(file: File, filePath: string): Promise<{
        fileLocation: string;
    }>;
    upload(file: File, filePath: string): Promise<{
        fileLocation: string;
    }>;
}
