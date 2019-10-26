export interface IStrategy {
    createUser(params: any): Promise<any>;
    createWallet(params: any): Promise<any>;
    getTransactions(params: any): Promise<any>;
    getBalances(params: any): Promise<any>;
}
