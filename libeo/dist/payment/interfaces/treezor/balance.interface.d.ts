import { ITreezor } from './treezor.interface';
export interface IBalanceParams extends ITreezor {
    walletId?: number;
    userId?: number;
}
export interface IBalance {
    walletId: number;
    currentBalance: number;
    authorizations: number;
    authorizedBalance: number;
    currency: string;
    calculationDate: string;
}
