import { ITreezorConfig } from './interfaces/treezor/config.interface';
import { IStrategy } from './interfaces/strategy.interface';
import { ICreateWalletParams } from './interfaces/treezor/wallet.interface';
import { ICreateUserParams, IUpdateUserParams, IUserParams, IUser } from './interfaces/treezor/user.interface';
import { IBalanceParams } from './interfaces/treezor/balance.interface';
import { ITransactionParams } from './interfaces/treezor/transaction.interface';
import { IBusinessParams, IBusinesses, ISearchParams, ISearch } from './interfaces/treezor/business.interface';
import { IDocumentParams, IDocuments, IDocument } from './interfaces/treezor/document.interface';
import { ICreateBeneficiaryParams, IBeneficiary } from './interfaces/treezor/beneficiary.interface';
import { ICreatePayoutParams, IPayout } from './interfaces/treezor/payout.interface';
import { ICreateTaxResidenceParams, ITaxResidence, IUpdateTaxResidenceParams } from './interfaces/treezor/taxresidence.interface';
import { ICreateMandateParams, IMandate, IDeleteMandateParams } from './interfaces/treezor/mandate.interface';
export declare class TreezorService implements IStrategy {
    private readonly utils;
    constructor(config: ITreezorConfig);
    createUser(data: ICreateUserParams): Promise<any>;
    updateUser(data: IUpdateUserParams): Promise<any>;
    removeUser(data: any): Promise<IUser>;
    createTaxResidence(data: ICreateTaxResidenceParams): Promise<ITaxResidence>;
    updateTaxResidence(data: IUpdateTaxResidenceParams): Promise<ITaxResidence>;
    createWallet(data: ICreateWalletParams): Promise<any>;
    createDocument(data: any): Promise<any>;
    createBeneficiary(data: ICreateBeneficiaryParams): Promise<IBeneficiary>;
    createPayout(data: ICreatePayoutParams): Promise<IPayout>;
    deletePayout(payoutId: number): Promise<any>;
    deleteDocument(documentId: number): Promise<IDocument>;
    getTransactions(params: ITransactionParams): Promise<any>;
    getBalances(params: IBalanceParams): Promise<any>;
    getBusinessInformations(params: IBusinessParams): Promise<IBusinesses>;
    getBeneficiaries(params: IUserParams): Promise<any>;
    getBeneficiary(beneficiaryId: number): Promise<any>;
    getDocuments(params: IDocumentParams): Promise<IDocuments>;
    getUser(params: any): Promise<any>;
    getTaxResidence(userId: number, country: string): Promise<any>;
    kycReview(data: any): Promise<any>;
    createMandate(data: ICreateMandateParams): Promise<IMandate>;
    deleteMandate(data: IDeleteMandateParams): Promise<IMandate>;
    getBusinessSearchs(data: ISearchParams): Promise<ISearch[]>;
}
