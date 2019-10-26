import { BankAccount } from '../entities/bank-account.entity';
import { Repository } from 'typeorm';
import { Company } from '../entities/company.entity';
import { List } from '../interfaces/common.interface';
import { CreateOrUpdateBankAccountDto } from '../dto/bank-account.dto';
import { IbansService } from './ibans.service';
import { User } from '../entities/user.entity';
import { Mandate } from '../entities/mandate.entity';
export declare class BankAccountService {
    private readonly bankAccountRepository;
    private readonly mandateRepository;
    private readonly ibansService;
    constructor(bankAccountRepository: Repository<BankAccount>, mandateRepository: Repository<Mandate>, ibansService: IbansService);
    createOrUpdateBankAccount(company: Company, user: User, data: CreateOrUpdateBankAccountDto, id?: string): Promise<BankAccount>;
    getBankAccounts(company: Company): Promise<List>;
    getBankAccount(company: Company, id: string): Promise<BankAccount>;
    changeDefaultBankAccount(company: Company, id: string): Promise<BankAccount[]>;
    removeBankAccount(company: Company, id: string): Promise<BankAccount>;
}
