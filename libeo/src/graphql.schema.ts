
/** ------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
export enum AccountingPreferenceType {
    LEDGER_BANK = "LEDGER_BANK",
    LEDGER_PURCHASE = "LEDGER_PURCHASE",
    LEDGER_SALES = "LEDGER_SALES",
    LEDGER_MISC = "LEDGER_MISC",
    VAT_ACCOUNT = "VAT_ACCOUNT",
    VENDOR_ACCOUNT = "VENDOR_ACCOUNT",
    PURCHASE_ACCOUNT = "PURCHASE_ACCOUNT",
    BANK_ACCOUNT = "BANK_ACCOUNT",
    BANK_ACCOUNT_TREEZOR = "BANK_ACCOUNT_TREEZOR"
}

export enum AddressOrder {
    createdAt_ASC = "createdAt_ASC",
    createdAt_DESC = "createdAt_DESC",
    updatedAt_ASC = "updatedAt_ASC",
    updatedAt_DESC = "updatedAt_DESC"
}

export enum CompanyProvisionningStrategies {
    TOPUP = "TOPUP",
    AUTOLOAD = "AUTOLOAD"
}

export enum ContactOrder {
    firstname_ASC = "firstname_ASC",
    firstname_DESC = "firstname_DESC",
    lastname_ASC = "lastname_ASC",
    lastname_DESC = "lastname_DESC",
    createdAt_ASC = "createdAt_ASC",
    createdAt_DESC = "createdAt_DESC",
    updatedAt_ASC = "updatedAt_ASC",
    updatedAt_DESC = "updatedAt_DESC"
}

export enum DocumentStatus {
    PENDING = "PENDING",
    CANCELED = "CANCELED",
    VALIDATED = "VALIDATED"
}

export enum HistoryEvent {
    UPDATE_STATUS = "UPDATE_STATUS"
}

export enum InvoiceStatus {
    IMPORTING = "IMPORTING",
    IMPORTED = "IMPORTED",
    SCANNING = "SCANNING",
    SCANNED = "SCANNED",
    TO_PAY = "TO_PAY",
    PLANNED = "PLANNED",
    AR_DRAFT = "AR_DRAFT",
    PAID = "PAID"
}

export enum KycStatus {
    PENDING = "PENDING",
    VALIDATED = "VALIDATED",
    REFUSED = "REFUSED"
}

export enum MandateStatus {
    PENDING = "PENDING",
    VALIDATED = "VALIDATED",
    REFUSED = "REFUSED",
    SIGNED = "SIGNED"
}

export enum PartnerOrder {
    createdAt_ASC = "createdAt_ASC",
    createdAt_DESC = "createdAt_DESC",
    updatedAt_ASC = "updatedAt_ASC",
    updatedAt_DESC = "updatedAt_DESC"
}

export enum Status {
    UNKNOWN = "UNKNOWN",
    EXIST = "EXIST",
    ALREADY = "ALREADY",
    SELF = "SELF"
}

export enum UserTitle {
    M = "M",
    MME = "MME",
    MLLE = "MLLE"
}

export class AccountingPreferenceInput {
    id?: string;
    key: string;
    value: string;
    description?: string;
    type: AccountingPreferenceType;
    order?: number;
    enabled?: boolean;
}

export class AddressInput {
    id?: string;
    siret?: string;
    address1?: string;
    address2?: string;
    zipcode?: number;
    city?: string;
    country?: string;
    companyId?: string;
}

export class BankAccountInput {
    label: string;
    iban?: string;
}

export class BeneficiaryInput {
    userId?: number;
    title?: UserTitle;
    firstname?: string;
    lastname?: string;
    nationality?: string;
    placeOfBirth?: string;
    birthCountry?: string;
    birthday?: string;
    specifiedUSPerson?: number;
    incomeRange?: string;
    personalAssets?: string;
    occupation?: string;
    controllingPersonType?: number;
    employeeType?: number;
    isCurrentUser?: boolean;
    isHosted?: boolean;
    phone?: string;
    address1?: string;
    address2?: string;
    postcode?: string;
    city?: string;
    country?: string;
    taxResidence?: string;
    documents?: DocumentInput[];
}

export class CompanyInput {
    siren?: string;
    siret?: string;
    name?: string;
    templatePreference?: number;
    logoUrl?: string;
    brandName?: string;
    slogan?: string;
    domainName?: string;
    naf?: string;
    nafNorm?: string;
    numberEmployees?: string;
    legalForm?: string;
    category?: string;
    incorporationAt?: Date;
    vatNumber?: string;
    capital?: number;
    legalAnnualTurnOver?: string;
    legalNetIncomeRange?: string;
    phone?: string;
    provisionningStrategy?: CompanyProvisionningStrategies;
    addresses?: AddressInput[];
}

export class ContactEmailInput {
    id?: string;
    email: string;
}

export class ContactInput {
    firstname: string;
    lastname: string;
    companyId?: string;
    emails?: ContactEmailInput[];
}

export class DocumentInput {
    documentTypeId: number;
    name: string;
    file?: Upload;
}

export class EmailInput {
    email: string;
    visibleOnlyCompany?: number;
    contact: string;
}

export class InvoiceFilters {
    status?: InvoiceStatus[];
    enabled?: boolean;
}

export class InvoiceInput {
    file?: Upload;
}

export class PartnerInput {
    name?: string;
    companyInitiatorId: number;
    companyPartnerId: number;
}

export class PasswordResetInput {
    password: string;
    confirmPassword: string;
    confirmationToken: string;
}

export class SendResetPasswordEmailInput {
    email: string;
}

export class SignInInput {
    email: string;
    password: string;
}

export class SignUpInput {
    firstname: string;
    lastname: string;
    email: string;
    password: string;
    passwordConfirmation: string;
    cgu: boolean;
}

export class UpdateInvoiceInput {
    receiverTitle?: string;
    number?: string;
    iban?: string;
    currency?: string;
    total?: number;
    totalWoT?: number;
    dueDate?: Date;
    invoiceDate?: Date;
    companyEmitter?: CompanyInput;
    ocrSirenFeedback?: JSON;
    ocrFeedback?: JSON;
    purchaseAccount?: string;
    companyEmitterId?: string;
    companyEmitterDetails?: JSON;
    companyEmitterContactDetails?: JSON;
    companyReceiverId?: string;
    companyReceiverDetails?: JSON;
    documentType?: string;
    emitterTitle?: string;
    invoiceDescription?: string;
    discount?: number;
    templateId?: number;
    displayLegalNotice?: JSON;
    vatAmounts?: JSON;
    products?: JSON;
    arCreatedById?: string;
    source?: string;
    status?: string;
}

export class UserInput {
    firstname: string;
    lastname: string;
    password?: string;
}

export class AccountingPreference {
    id?: string;
    key?: string;
    value?: string;
    description?: string;
    type?: AccountingPreferenceType;
    order?: number;
    enabled?: boolean;
    company?: Company;
    createdAt?: Date;
    updatedAt?: Date;
}

export class AccountingPreferences {
    total?: number;
    rows?: AccountingPreference[];
}

export class Address {
    id?: string;
    siret?: string;
    address1?: string;
    address2?: string;
    zipcode?: number;
    city?: string;
    country?: string;
}

export class Addresses {
    total?: number;
    rows?: Address[];
}

export class Balance {
    walletId?: number;
    currentBalance?: number;
    authorizations?: number;
    authorizedBalance?: number;
    currency?: string;
    calculationDate?: string;
}

export class BankAccount {
    id?: string;
    company?: Company;
    mandates?: Mandate[];
    iban?: Iban;
    label?: string;
    default?: boolean;
    enabled?: boolean;
}

export class BankAccounts {
    total?: number;
    rows?: BankAccount[];
}

export class Beneficiaries {
    total?: number;
    rows?: Beneficiary[];
}

export class Beneficiary {
    userId?: number;
    userTypeId?: number;
    userStatus?: string;
    userTag?: string;
    parentUserId?: number;
    parentType?: string;
    specifiedUSPerson?: number;
    controllingPersonType?: number;
    employeeType?: number;
    title?: string;
    firstname?: string;
    lastname?: string;
    middleNames?: string;
    birthday?: string;
    email?: string;
    address1?: string;
    address2?: string;
    postcode?: string;
    city?: string;
    state?: string;
    country?: string;
    countryName?: string;
    phone?: string;
    mobile?: string;
    nationality?: string;
    nationalityOther?: string;
    placeOfBirth?: string;
    birthCountry?: string;
    occupation?: string;
    incomeRange?: string;
    legalName?: string;
    legalNameEmbossed?: string;
    legalRegistrationNumber?: string;
    legalTvaNumber?: string;
    legalRegistrationDate?: string;
    legalForm?: string;
    legalShareCapital?: number;
    legalSector?: string;
    legalAnnualTurnOver?: string;
    legalNetIncomeRange?: string;
    legalNumberOfEmployeeRange?: string;
    effectiveBeneficiary?: number;
    kycLevel?: number;
    kycReview?: number;
    kycReviewComment?: string;
    isFreezed?: number;
    language?: string;
    optInMailing?: number;
    sepaCreditorIdentifier?: string;
    taxNumber?: string;
    taxResidence?: string;
    position?: string;
    personalAssets?: string;
    createdDate?: string;
    modifiedDate?: string;
    walletCount?: number;
    payinCount?: number;
    documents?: Documents;
}

export class BicCondidate {
    bic?: string;
    zip?: string;
    city?: string;
    wwwcount?: number;
    sampleurl?: string;
}

export class CheckIban {
    iban?: string;
    bic?: string;
    status?: string;
    name?: string;
}

export class Companies {
    total?: number;
    rows?: Company[];
}

export class Company {
    id?: string;
    siren?: string;
    siret?: string;
    name?: string;
    brandName?: string;
    templatePreference?: number;
    logoUrl?: string;
    slogan?: string;
    domainName?: string;
    naf?: string;
    nafNorm?: string;
    numberEmployees?: string;
    legalForm?: string;
    category?: string;
    incorporationAt?: Date;
    vatNumber?: string;
    source?: string;
    treezorEmail?: string;
    treezorUserId?: number;
    treezorWalletId?: number;
    treezorIban?: string;
    treezorBic?: string;
    claimer?: User;
    status?: Status;
    kycStatus?: KycStatus;
    kycStep?: string;
    capital?: number;
    legalAnnualTurnOver?: string;
    legalNetIncomeRange?: string;
    phone?: string;
    invoicesSent?: number;
    invoicesReceived?: number;
    contacts?: Contacts;
    addresses?: Addresses;
    ibans?: Ibans;
    createdAt?: Date;
    updatedAt?: Date;
    provisionningStrategy?: CompanyProvisionningStrategies;
}

export class ComplementaryInfos {
    capital?: number;
    legalAnnualTurnOver?: string;
    numberEmployees?: string;
    legalNetIncomeRange?: string;
    phone?: string;
    addresses?: Addresses;
}

export class Contact {
    id?: string;
    firstname?: string;
    lastname?: string;
    user?: User;
    company?: Company;
    emails?: Emails;
    createdAt?: Date;
    updatedAt?: Date;
}

export class Contacts {
    total?: number;
    rows?: Contact[];
}

export class Document {
    documentId?: number;
    documentTag?: string;
    documentStatus?: DocumentStatus;
    documentTypeId?: number;
    documentType?: string;
    residenceId?: number;
    clientId?: number;
    userId?: number;
    userLastname?: string;
    userFirstname?: string;
    fileName?: string;
    temporaryUrl?: string;
    temporaryUrlThumb?: string;
    createdDate?: string;
    modifiedDate?: string;
}

export class Documents {
    total?: number;
    rows?: Document[];
}

export class Email {
    id?: string;
    email?: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export class Emails {
    total?: number;
    rows?: Email[];
}

export class Export {
    id?: string;
    company?: Company;
    fileLink?: string;
    enabled?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}

export class Exports {
    total?: number;
    rows?: Export[];
}

export class Histories {
    total?: number;
    rows?: History[];
}

export class History {
    id?: string;
    event?: HistoryEvent;
    params?: JSON;
    user?: User;
    createdAt?: Date;
    updatedAt?: Date;
}

export class Iban {
    id?: string;
    iban?: string;
    readerCompany?: Company;
    treezorBeneficiaryId?: number;
    createdBy?: User;
    company?: Company;
    result?: string;
    returnCode?: number;
    bic?: string;
    bicCondidates?: JSON;
    country?: string;
    bankCode?: string;
    bank?: string;
    bankAddress?: string;
    branch?: string;
    branchCode?: string;
    inSclDirectory?: string;
    sct?: string;
    sdd?: string;
    cor1?: string;
    b2b?: string;
    scc?: string;
    jsonIbanBic?: JSON;
    createdAt?: Date;
    updatedAt?: Date;
}

export class Ibans {
    total?: number;
    rows?: Iban[];
}

export class Invoice {
    id?: string;
    status?: string;
    filename?: string;
    filepath?: string;
    importAt?: Date;
    importedBy?: User;
    createdBy?: User;
    companyEmitter?: Company;
    companyReceiver?: Company;
    number?: string;
    iban?: Iban;
    currency?: string;
    total?: number;
    totalWoT?: number;
    dueDate?: Date;
    invoiceDate?: Date;
    receiverTitle?: string;
    emitterTitle?: string;
    enabled?: boolean;
    error?: boolean;
    ocrStatus?: string;
    ocrPartner?: string;
    ocrSirenFeedback?: JSON;
    ocrFeedback?: JSON;
    history?: Histories;
    purchaseAccount?: AccountingPreference;
    estimatedBalance?: number;
    paymentAt?: Date;
    createdAt?: Date;
    updatedAt?: Date;
    companyEmitterId?: string;
    companyEmitterDetails?: JSON;
    companyEmitterContactDetails?: JSON;
    companyReceiverId?: string;
    companyReceiverDetails?: JSON;
    documentType?: string;
    invoiceDescription?: string;
    discount?: number;
    templateId?: number;
    displayLegalNotice?: JSON;
    vatAmounts?: JSON;
    products?: JSON;
    arCreatedById?: string;
    source?: string;
}

export class Invoices {
    total?: number;
    rows?: Invoice[];
}

export class Mandate {
    id?: string;
    bankAccount?: BankAccount;
    treezorMandateId?: string;
    rum?: string;
    filePath?: string;
    status?: string;
    signatory?: User;
    signatoryIp?: string;
    validationCode?: string;
    signaturedAt?: Date;
    createdAt?: Date;
    updatedAt?: Date;
}

export abstract class IMutation {
    abstract signin(input: SignInInput): User | Promise<User>;

    abstract signup(input: SignUpInput): User | Promise<User>;

    abstract sendPasswordResetEmail(input: SendResetPasswordEmailInput): PasswordReset | Promise<PasswordReset>;

    abstract resetPassword(input: PasswordResetInput): boolean | Promise<boolean>;

    abstract logout(): boolean | Promise<boolean>;

    abstract createOrUpdateAccountingPreferences(input: AccountingPreferenceInput[]): AccountingPreferences | Promise<AccountingPreferences>;

    abstract createOrUpdateAddress(input: AddressInput): Address | Promise<Address>;

    abstract removeAddress(id: string): Address | Promise<Address>;

    abstract createOrUpdateBankAccount(input: BankAccountInput, id?: string): BankAccount | Promise<BankAccount>;

    abstract changeDefaultBankAccount(id: string): BankAccount[] | Promise<BankAccount[]>;

    abstract removeBankAccount(id: string): BankAccount | Promise<BankAccount>;

    abstract createBeneficiary(input: BeneficiaryInput): Beneficiary | Promise<Beneficiary>;

    abstract removeBeneficiary(id: number): Beneficiary | Promise<Beneficiary>;

    abstract createOrUpdateCompany(id?: string, input?: CompanyInput): Company | Promise<Company>;

    abstract signContract(): boolean | Promise<boolean>;

    abstract updateKycStatus(status?: KycStatus): Company | Promise<Company>;

    abstract updateKycStep(step?: string): Company | Promise<Company>;

    abstract removeDocument(id: number): Document | Promise<Document>;

    abstract uploadLogo(file: Upload): string | Promise<string>;

    abstract createContact(input?: ContactInput): Contact | Promise<Contact>;

    abstract updateContact(id: string, input: ContactInput): Contact | Promise<Contact>;

    abstract createEmail(input: EmailInput): Email | Promise<Email>;

    abstract updateEmail(id: string, input: EmailInput): Email | Promise<Email>;

    abstract export(): string | Promise<string>;

    abstract createInvoice(input?: InvoiceInput): Invoice | Promise<Invoice>;

    abstract createOrUpdateAR(input: UpdateInvoiceInput, id?: string): Invoice | Promise<Invoice>;

    abstract updateInvoice(id: string, input: UpdateInvoiceInput): Invoice | Promise<Invoice>;

    abstract updateInvoiceStatus(id: string, status: InvoiceStatus): Invoice[] | Promise<Invoice[]>;

    abstract removeInvoice(id: string): Invoice | Promise<Invoice>;

    abstract removeAll(input?: boolean): boolean | Promise<boolean>;

    abstract generateCode(invoiceId: string): Invoice | Promise<Invoice>;

    abstract uploadRib(file: Upload, invoiceId: string): string | Promise<string>;

    abstract createMandate(bankAccountId: string): Mandate | Promise<Mandate>;

    abstract generateCodeMandate(id: string): Mandate | Promise<Mandate>;

    abstract signedMandate(id: string, code: string): Mandate | Promise<Mandate>;

    abstract removeMandate(id: string): Mandate | Promise<Mandate>;

    abstract createPartner(input: CompanyInput): Company | Promise<Company>;

    abstract payout(invoiceId: string, date?: string, code?: string): Invoice[] | Promise<Invoice[]>;

    abstract payoutContacts(invoiceId: string, contactIds?: string[]): boolean | Promise<boolean>;

    abstract refreshConfirmationTokenUser(email: string): User | Promise<User>;

    abstract activateUser(confirmationToken: string): boolean | Promise<boolean>;

    abstract updateUser(input: UserInput): User | Promise<User>;
}

export class Partner {
    id?: string;
    name?: string;
    companyInitiator?: Company;
    companyPartner?: Company;
    createdAt?: Date;
    updatedAt?: Date;
}

export class Partners {
    total?: number;
    rows?: Partner[];
}

export class PasswordReset {
    status: boolean;
}

export abstract class IQuery {
    abstract accountingPreferences(types?: AccountingPreferenceType[], default?: boolean): AccountingPreferences | Promise<AccountingPreferences>;

    abstract balance(): Balance | Promise<Balance>;

    abstract checkBalance(invoiceId: string, paymentAt?: Date): boolean | Promise<boolean>;

    abstract bankAccounts(): BankAccounts | Promise<BankAccounts>;

    abstract bankAccount(id: string): BankAccount | Promise<BankAccount>;

    abstract beneficiaries(limit?: number, page?: number): Beneficiaries | Promise<Beneficiaries>;

    abstract taxResidence(userId?: number, country?: string): TaxResidence | Promise<TaxResidence>;

    abstract searchCompanies(query: string, limit?: number, offset?: number): Companies | Promise<Companies>;

    abstract contract(): string | Promise<string>;

    abstract company(): Company | Promise<Company>;

    abstract representatives(): Representatives | Promise<Representatives>;

    abstract companyWithComplementaryInfos(siren: string): ComplementaryInfos | Promise<ComplementaryInfos>;

    abstract exports(limit?: number, offset?: number): Exports | Promise<Exports>;

    abstract checkIban(iban: string): CheckIban | Promise<CheckIban>;

    abstract ibans(siren: string): Ibans | Promise<Ibans>;

    abstract invoices(filters?: InvoiceFilters, limit?: number, offset?: number): Invoices | Promise<Invoices>;

    abstract emittedInvoices(filters?: InvoiceFilters, limit?: number, offset?: number): Invoices | Promise<Invoices>;

    abstract invoice(id: string): Invoice | Promise<Invoice>;

    abstract emittedInvoice(id: string): Invoice | Promise<Invoice>;

    abstract mandate(id: string): Mandate | Promise<Mandate>;

    abstract partners(orderBy?: PartnerOrder, limit?: number, offset?: number): Companies | Promise<Companies>;

    abstract partner(id?: string): Company | Promise<Company>;

    abstract transactions(limit?: number, page?: number): Transactions | Promise<Transactions>;

    abstract me(): User | Promise<User>;

    abstract temp__(): boolean | Promise<boolean>;
}

export class Representative {
    firstname?: string;
    lastname?: string;
    fullnames?: string;
    birthday?: string;
    parentType?: string;
    userTypeId?: number;
}

export class Representatives {
    total?: number;
    rows?: Representative[];
}

export class TaxResidence {
    id?: number;
    userId?: number;
    country?: string;
    taxPayerId?: string;
    liabilityWaiver?: boolean;
    createdDate?: string;
    lastUpdate?: string;
    deletedDate?: string;
    isDeleted?: boolean;
}

export class Transaction {
    transactionId?: number;
    walletDebitId?: number;
    walletCreditId?: number;
    transactionType?: string;
    foreignId?: number;
    name?: string;
    description?: string;
    valueDate?: string;
    executionDate?: string;
    amount?: string;
    walletDebitBalance?: string;
    walletCreditBalance?: string;
    currency?: string;
    createdDate?: string;
}

export class Transactions {
    total?: number;
    rows?: Transaction[];
}

export class User {
    id?: string;
    firstname?: string;
    lastname?: string;
    email?: string;
    token?: string;
    lastLogin?: Date;
    lastCguAccept?: Date;
    currentCompany?: Company;
    companies?: Companies;
    createdAt?: Date;
    updatedAt?: Date;
}

export type Date = any;
export type JSON = any;
export type Upload = any;
