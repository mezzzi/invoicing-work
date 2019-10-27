import { EntitySubscriberInterface, UpdateEvent, InsertEvent } from 'typeorm';
import { Payment } from '../entities/payment.entity';
export declare class PaymentSubscriber implements EntitySubscriberInterface<Payment> {
    private checkStatusChange;
    private createHistory;
    listenTo(): typeof Payment;
    afterInsert(event: InsertEvent<Payment>): void;
    afterUpdate(event: UpdateEvent<Payment>): Promise<void>;
}
