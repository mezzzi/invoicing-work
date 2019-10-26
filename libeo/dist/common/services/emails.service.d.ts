import { Repository } from 'typeorm';
import { Contact } from '../entities/contact.entity';
import { Email } from '../entities/email.entity';
import { List } from '../interfaces/common.interface';
import { CreateEmailDto, UpdateEmailDto } from '../dto/emails.dto';
export declare class EmailsService {
    private readonly emailRepository;
    constructor(emailRepository: Repository<Email>);
    createEmail(data: CreateEmailDto): Promise<Email>;
    createEmails(data: CreateEmailDto[]): Promise<Email[]>;
    updateEmail(id: string, data: UpdateEmailDto): Promise<Email>;
    findByContact(contact: Contact, orderBy?: string, limit?: number, offset?: number): Promise<List>;
}
