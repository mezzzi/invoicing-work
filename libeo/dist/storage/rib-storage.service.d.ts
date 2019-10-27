import { File } from '../common/interfaces/file.interface';
import { AbstractStorageService } from './abstract-storage.service';
export declare class RibStorageService {
    private readonly fileStorageService;
    constructor(fileStorageService: AbstractStorageService);
    upload(file: File, companyId: string): Promise<{
        fileLocation: string;
    }>;
}
