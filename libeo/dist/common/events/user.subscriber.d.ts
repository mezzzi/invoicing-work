import { EntitySubscriberInterface, InsertEvent } from 'typeorm';
import { User } from '../entities/user.entity';
export declare class UserSubscriber implements EntitySubscriberInterface<User> {
    private createDefaultAccountingPreferences;
    listenTo(): typeof User;
    afterInsert(event: InsertEvent<User>): void;
}
