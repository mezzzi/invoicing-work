import { Repository } from 'typeorm';
import { Webhook } from '../entities/webhook.entity';
import { IWebhook } from '../interfaces/webhook.interface';
export declare class WebhooksService {
    private readonly webhookRepository;
    constructor(webhookRepository: Repository<Webhook>);
    private snakeToCamel;
    createWebhook(data: IWebhook): Promise<Webhook>;
}
