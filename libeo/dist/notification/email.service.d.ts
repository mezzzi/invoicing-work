import { EmailServiceInterface } from './interface/email-service.interface';
import { Logger } from '@nestjs/common';
import { EmailMessage } from './interface/email-message.interface';
import { ConfigService } from 'nestjs-config';
export declare class EmailService implements EmailServiceInterface {
    private readonly logger;
    private readonly mailer;
    constructor(configService: ConfigService, logger: Logger);
    send(messagesDetail: EmailMessage<any>[]): Promise<void>;
}
