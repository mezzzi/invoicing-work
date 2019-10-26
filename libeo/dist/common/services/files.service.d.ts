import { File } from '../interfaces/file.interface';
export declare class FileService {
    private readonly options;
    private readonly mimetype;
    private readonly file;
    originalFilename: string;
    filename: string;
    constructor(file: File, options?: any);
    private uploadLocal;
    private uploadS3;
    createDirectory(): void;
    upload(): Promise<any>;
    getExtension(): string;
    generateFilename(): string;
}
