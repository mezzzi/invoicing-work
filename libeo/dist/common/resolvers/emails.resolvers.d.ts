import { EmailsService } from '../services/emails.service';
import { CreateEmailDto, UpdateEmailDto } from '../dto/emails.dto';
import { Email } from '../entities/email.entity';
export declare class EmailsResolvers {
    private readonly emailsService;
    constructor(emailsService: EmailsService);
    createEmail(input: CreateEmailDto): Promise<Email>;
    updateEmail(id: string, input: UpdateEmailDto): Promise<Email>;
}
