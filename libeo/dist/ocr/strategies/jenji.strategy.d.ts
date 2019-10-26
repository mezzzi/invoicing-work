import { Config } from '../interfaces/config.interface';
import { Strategy } from '../interfaces/strategy.interface';
export declare class JenjiStrategy implements Strategy {
    private readonly config;
    private file;
    constructor(config: Config);
    private getBasicToken;
    loadFile(filePath: string): Promise<any>;
    getData(): Promise<any>;
}
