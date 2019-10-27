import { Logger } from '@nestjs/common';
import { ConfigService } from 'nestjs-config';
import { File } from '../common/interfaces/file.interface';
import { AbstractStorageService } from './abstract-storage.service';
export declare class AWSStorageService extends AbstractStorageService {
    readonly logger: Logger;
    private readonly AWSS3Service;
    private readonly bucket;
    constructor(config: ConfigService, logger: Logger);
    uploadImplementation(file: File, filePath: string): Promise<{
        fileLocation: any;
    }>;
}
