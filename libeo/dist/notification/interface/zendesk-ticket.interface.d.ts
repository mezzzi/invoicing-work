interface ZendeskRequester {
    name: string;
    email: string;
}
interface ZendeskComment {
    body: string;
}
export declare enum ZendeskTicketType {
    PROBLEM = "problem",
    INCIDENT = "incident",
    QUESTION = "question",
    TASK = "task"
}
export declare enum ZendesTicketPriority {
    URGENT = "urgent",
    HIGH = "high",
    NORMAL = "normal",
    LOW = "low"
}
export interface ZendeskCustomField {
    id: number;
    value: string;
}
export interface ZendeskCreateTicket {
    type?: ZendeskTicketType;
    priority: ZendesTicketPriority;
    requester: ZendeskRequester;
    subject: string;
    comment: ZendeskComment;
    customFields?: ZendeskCustomField[];
}
export {};
