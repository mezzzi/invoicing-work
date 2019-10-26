import { Repository } from 'typeorm';
import { List } from '../interfaces/common.interface';
import { CreateContactDto, UpdateContactDto } from '../dto/contacts.dto';
import { Contact } from '../entities/contact.entity';
import { Company } from '../entities/company.entity';
import { User } from '../entities/user.entity';
import { EmailsService } from './emails.service';
export declare class ContactsService {
    private readonly contactRepository;
    private readonly companyRepository;
    private readonly emailsService;
    constructor(contactRepository: Repository<Contact>, companyRepository: Repository<Company>, emailsService: EmailsService);
    createContact(user: User, data: CreateContactDto): Promise<any>;
    updateContact(id: string, data: UpdateContactDto): Promise<Contact>;
    findByCompany(user: User, company: Company, orderBy?: string, limit?: number, offset?: number): Promise<List>;
    findByCompanyAndIds(company: Company, contactIds: string[], visibleOnlyCompany?: Company): Promise<Contact[]>;
}
