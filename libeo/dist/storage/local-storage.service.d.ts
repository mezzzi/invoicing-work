import { File } from '../common/interfaces/file.interface';
import { AbstractStorageService } from './abstract-storage.service';
export declare class LocalStorageService extends AbstractStorageService {
    uploadImplementation(file: File, filePath: string): Promise<{
        fileLocation: string;
    }>;
}
