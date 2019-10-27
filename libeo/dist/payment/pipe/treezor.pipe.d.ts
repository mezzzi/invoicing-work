import { PipeTransform } from '@nestjs/common';
import { IWebhook } from '../../common/interfaces/webhook.interface';
import { Webhook } from '../../common/entities/webhook.entity';
import { TreezorAPI } from '../treezor.api';
import { Repository } from 'typeorm';
export declare class TreezorSignatureValidationPipe implements PipeTransform {
    private readonly treezorApi;
    constructor(treezorApi: TreezorAPI);
    transform(body: Webhook): Webhook;
}
export declare class CamelCaseifyPayloadPipe implements PipeTransform {
    transform(body: IWebhook): Webhook;
}
export declare class SaveTreezorWebhookPipe implements PipeTransform {
    private readonly webhookRepository;
    constructor(webhookRepository: Repository<Webhook>);
    transform(body: Webhook): Webhook;
}
