import { ZendeskService } from './zendesk.service';
import { User } from '../common/entities/user.entity';
export declare class SupportService {
    private readonly zendeskService;
    constructor(zendeskService: ZendeskService);
    createTicketNewUser(user: User): Promise<void>;
}
