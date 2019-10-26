import { EmailServiceInterface } from './interface/email-service.interface';
import { EmailMessage } from './interface/email-message.interface';
import { ConfigService } from 'nestjs-config';
export declare class EmailService implements EmailServiceInterface {
    constructor(configService: ConfigService);
    private readonly mailer;
    send(messagesDetail: EmailMessage<any>[]): void;
}
