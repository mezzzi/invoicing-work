import { Contact } from '../entities/contact.entity';
declare class BaseEmailDto {
    email: string;
    contact: Contact;
    visibleOnlyCompany: string;
}
export declare class CreateEmailDto extends BaseEmailDto {
}
export declare class UpdateEmailDto extends BaseEmailDto {
}
export {};
