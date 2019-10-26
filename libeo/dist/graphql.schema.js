"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var AddressOrder;
(function (AddressOrder) {
    AddressOrder["createdAt_ASC"] = "createdAt_ASC";
    AddressOrder["createdAt_DESC"] = "createdAt_DESC";
    AddressOrder["updatedAt_ASC"] = "updatedAt_ASC";
    AddressOrder["updatedAt_DESC"] = "updatedAt_DESC";
})(AddressOrder = exports.AddressOrder || (exports.AddressOrder = {}));
var ContactOrder;
(function (ContactOrder) {
    ContactOrder["firstname_ASC"] = "firstname_ASC";
    ContactOrder["firstname_DESC"] = "firstname_DESC";
    ContactOrder["lastname_ASC"] = "lastname_ASC";
    ContactOrder["lastname_DESC"] = "lastname_DESC";
    ContactOrder["createdAt_ASC"] = "createdAt_ASC";
    ContactOrder["createdAt_DESC"] = "createdAt_DESC";
    ContactOrder["updatedAt_ASC"] = "updatedAt_ASC";
    ContactOrder["updatedAt_DESC"] = "updatedAt_DESC";
})(ContactOrder = exports.ContactOrder || (exports.ContactOrder = {}));
var DocumentStatus;
(function (DocumentStatus) {
    DocumentStatus["PENDING"] = "PENDING";
    DocumentStatus["CANCELED"] = "CANCELED";
    DocumentStatus["VALIDATED"] = "VALIDATED";
})(DocumentStatus = exports.DocumentStatus || (exports.DocumentStatus = {}));
var HistoryEvent;
(function (HistoryEvent) {
    HistoryEvent["UPDATE_STATUS"] = "UPDATE_STATUS";
})(HistoryEvent = exports.HistoryEvent || (exports.HistoryEvent = {}));
var InvoiceStatus;
(function (InvoiceStatus) {
    InvoiceStatus["IMPORTING"] = "IMPORTING";
    InvoiceStatus["IMPORTED"] = "IMPORTED";
    InvoiceStatus["SCANNING"] = "SCANNING";
    InvoiceStatus["SCANNED"] = "SCANNED";
    InvoiceStatus["TO_PAY"] = "TO_PAY";
    InvoiceStatus["PLANNED"] = "PLANNED";
    InvoiceStatus["PAID"] = "PAID";
})(InvoiceStatus = exports.InvoiceStatus || (exports.InvoiceStatus = {}));
var KycStatus;
(function (KycStatus) {
    KycStatus["PENDING"] = "PENDING";
    KycStatus["VALIDATED"] = "VALIDATED";
    KycStatus["REFUSED"] = "REFUSED";
})(KycStatus = exports.KycStatus || (exports.KycStatus = {}));
var PartnerOrder;
(function (PartnerOrder) {
    PartnerOrder["createdAt_ASC"] = "createdAt_ASC";
    PartnerOrder["createdAt_DESC"] = "createdAt_DESC";
    PartnerOrder["updatedAt_ASC"] = "updatedAt_ASC";
    PartnerOrder["updatedAt_DESC"] = "updatedAt_DESC";
})(PartnerOrder = exports.PartnerOrder || (exports.PartnerOrder = {}));
var Status;
(function (Status) {
    Status["UNKNOWN"] = "UNKNOWN";
    Status["EXIST"] = "EXIST";
    Status["ALREADY"] = "ALREADY";
    Status["SELF"] = "SELF";
})(Status = exports.Status || (exports.Status = {}));
var UserTitle;
(function (UserTitle) {
    UserTitle["M"] = "M";
    UserTitle["MME"] = "MME";
    UserTitle["MLLE"] = "MLLE";
})(UserTitle = exports.UserTitle || (exports.UserTitle = {}));
class AddressInput {
}
exports.AddressInput = AddressInput;
class BeneficiaryInput {
}
exports.BeneficiaryInput = BeneficiaryInput;
class CompanyInput {
}
exports.CompanyInput = CompanyInput;
class ContactEmailInput {
}
exports.ContactEmailInput = ContactEmailInput;
class ContactInput {
}
exports.ContactInput = ContactInput;
class DocumentInput {
}
exports.DocumentInput = DocumentInput;
class EmailInput {
}
exports.EmailInput = EmailInput;
class InvoiceFilters {
}
exports.InvoiceFilters = InvoiceFilters;
class InvoiceInput {
}
exports.InvoiceInput = InvoiceInput;
class PartnerInput {
}
exports.PartnerInput = PartnerInput;
class SignInInput {
}
exports.SignInInput = SignInInput;
class SignUpInput {
}
exports.SignUpInput = SignUpInput;
class UpdateInvoiceInput {
}
exports.UpdateInvoiceInput = UpdateInvoiceInput;
class UserInput {
}
exports.UserInput = UserInput;
class Address {
}
exports.Address = Address;
class Addresses {
}
exports.Addresses = Addresses;
class Balance {
}
exports.Balance = Balance;
class Beneficiaries {
}
exports.Beneficiaries = Beneficiaries;
class Beneficiary {
}
exports.Beneficiary = Beneficiary;
class Companies {
}
exports.Companies = Companies;
class Company {
}
exports.Company = Company;
class ComplementaryInfos {
}
exports.ComplementaryInfos = ComplementaryInfos;
class Contact {
}
exports.Contact = Contact;
class Contacts {
}
exports.Contacts = Contacts;
class Document {
}
exports.Document = Document;
class Documents {
}
exports.Documents = Documents;
class Email {
}
exports.Email = Email;
class Emails {
}
exports.Emails = Emails;
class Histories {
}
exports.Histories = Histories;
class History {
}
exports.History = History;
class Iban {
}
exports.Iban = Iban;
class Invoice {
}
exports.Invoice = Invoice;
class Invoices {
}
exports.Invoices = Invoices;
class IMutation {
}
exports.IMutation = IMutation;
class Partner {
}
exports.Partner = Partner;
class Partners {
}
exports.Partners = Partners;
class IQuery {
}
exports.IQuery = IQuery;
class Representative {
}
exports.Representative = Representative;
class Representatives {
}
exports.Representatives = Representatives;
class TaxResidence {
}
exports.TaxResidence = TaxResidence;
class Transaction {
}
exports.Transaction = Transaction;
class Transactions {
}
exports.Transactions = Transactions;
class User {
}
exports.User = User;
//# sourceMappingURL=graphql.schema.js.map