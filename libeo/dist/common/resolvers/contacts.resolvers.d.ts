import { List } from '../interfaces/common.interface';
import { CreateContactDto, UpdateContactDto } from '../dto/contacts.dto';
import { ContactsService } from '../services/contacts.service';
import { EmailsService } from '../services/emails.service';
import { Contact } from '../entities/contact.entity';
export declare class ContactsResolvers {
    private readonly contactsService;
    private readonly emailsService;
    constructor(contactsService: ContactsService, emailsService: EmailsService);
    createContact(ctx: any, input: CreateContactDto): Promise<Contact>;
    updateContact(id: string, input: UpdateContactDto): Promise<Contact>;
    emails(contact: Contact): Promise<List>;
}
