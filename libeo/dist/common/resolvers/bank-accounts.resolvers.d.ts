import { BankAccountService } from '../services/bank-account.service';
import { CreateOrUpdateBankAccountDto } from '../dto/bank-account.dto';
import { List } from '../interfaces/common.interface';
import { BankAccount } from '../entities/bank-account.entity';
export declare class BankAccountResolver {
    private readonly bankAccountService;
    constructor(bankAccountService: BankAccountService);
    createOrUpdateBankAccount(ctx: any, input: CreateOrUpdateBankAccountDto, id: string): Promise<BankAccount>;
    changeDefaultBankAccount(ctx: any, id: string): Promise<BankAccount[]>;
    removeBankAccount(ctx: any, id: string): Promise<BankAccount>;
    bankAccounts(ctx: any): Promise<List>;
    bankAccount(ctx: any, id: string): Promise<BankAccount>;
}
