import { ConfigService } from 'nestjs-config';
import { ZendeskCreateTicket } from './interface/zendesk-ticket.interface';
export declare class ZendeskService {
    private readonly zendeskClient;
    private readonly environmentZendesk;
    constructor(configService: ConfigService);
    createTicket(obj: ZendeskCreateTicket): Promise<void>;
}
