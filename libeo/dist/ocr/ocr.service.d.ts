export declare class OcrService {
    private readonly strategy;
    private isLoadFile;
    constructor(type: string, config: any);
    loadFile(filePath: string): Promise<any>;
    getData(): Promise<any>;
}
