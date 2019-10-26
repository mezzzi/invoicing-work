declare class BaseContactDto {
    firstname: string;
    lastname: string;
    companyId?: string;
    emails?: Email[];
}
declare class Email {
    id?: string;
    email: string;
}
export declare class CreateContactDto extends BaseContactDto {
}
export declare class UpdateContactDto extends BaseContactDto {
}
export {};
