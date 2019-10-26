import { ITreezor } from './treezor.interface';
export interface ICreatePayoutParams extends ITreezor {
    payoutTag?: string;
    walletId: number;
    bankaccountId?: number;
    beneficiaryId?: number;
    label?: string;
    amount: number;
    currency: string;
    supportingFileLink?: string;
}
export interface IPayout {
    payoutId: number;
    payoutTag: string;
    payoutStatus: string;
    payoutTypeId: number;
    payoutType: string;
    walletId: number;
    payoutDate: string;
    walletEventName: string;
    walletAlias: string;
    userFirstname: string;
    userLastname: string;
    userId: number;
    bankaccountId: number;
    beneficiaryId: number;
    uniqueMandateReference: string;
    bankaccountIBAN: string;
    label: string;
    amount: string;
    currency: string;
    partnerFee: string;
    createdDate: string;
    modifiedDate: string;
    totalRows: number;
}
export interface IPayouts {
    payouts: IPayout[];
}
