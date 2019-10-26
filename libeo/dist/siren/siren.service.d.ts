import { SirenStrategy } from './strategies/siren.strategy';
import { TreezorStrategy } from './strategies/treezor.strategy';
import { Logger } from '@nestjs/common';
declare enum Strategies {
    SirenStrategy = "SirenStrategy",
    TreezorStrategy = "TreezorStrategy"
}
export declare class SirenService {
    private readonly sirenStrategy;
    private readonly treezorStrategy;
    private readonly logger;
    private strategy;
    constructor(sirenStrategy: SirenStrategy, treezorStrategy: TreezorStrategy, logger: Logger);
    switchStrategy(strategy: Strategies): void;
    search(query: string, orderBy?: string, limit?: number, offset?: number): Promise<any>;
}
export {};
