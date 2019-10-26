import { Mandate } from '../entities/mandate.entity';
import { Repository } from 'typeorm';
import { Company } from '../entities/company.entity';
import { BankAccount } from '../entities/bank-account.entity';
import { Address } from '../entities/address.entity';
import { User } from '../entities/user.entity';
import { MandateRepository } from '../repositories/mandate.repository';
import { EmailService } from '../../notification/email.service';
export declare class MandatesService {
    private readonly mandateRepository;
    private readonly bankAccountRepository;
    private readonly addressRepository;
    private readonly emailService;
    constructor(mandateRepository: MandateRepository, bankAccountRepository: Repository<BankAccount>, addressRepository: Repository<Address>, emailService: EmailService);
    createMandate(user: User, bankAccountId: string, ip: string): Promise<Mandate>;
    signedMandate(user: User, mandateId: string, code: string): Promise<Mandate>;
    getMandate(company: Company, mandateId: string): Promise<Mandate>;
    generateCodeMandate(user: User, mandateId: string): Promise<Mandate>;
    removeMandate(company: Company, mandateId: string): Promise<Mandate>;
}
