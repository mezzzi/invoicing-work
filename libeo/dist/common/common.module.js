"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const date_scalar_1 = require("./scalars/date.scalar");
const typeorm_1 = require("@nestjs/typeorm");
const partner_entity_1 = require("./entities/partner.entity");
const company_entity_1 = require("./entities/company.entity");
const user_entity_1 = require("./entities/user.entity");
const partners_service_1 = require("./services/partners.service");
const partners_resolvers_1 = require("./resolvers/partners.resolvers");
const companies_service_1 = require("./services/companies.service");
const users_service_1 = require("./services/users.service");
const email_entity_1 = require("./entities/email.entity");
const contact_entity_1 = require("./entities/contact.entity");
const contacts_service_1 = require("./services/contacts.service");
const addresses_service_1 = require("./services/addresses.service");
const emails_service_1 = require("./services/emails.service");
const address_entity_1 = require("./entities/address.entity");
const companies_resolvers_1 = require("./resolvers/companies.resolvers");
const users_resolvers_1 = require("./resolvers/users.resolvers");
const addresses_resolvers_1 = require("./resolvers/addresses.resolvers");
const contacts_resolvers_1 = require("./resolvers/contacts.resolvers");
const emails_resolvers_1 = require("./resolvers/emails.resolvers");
const invoices_resolvers_1 = require("./resolvers/invoices.resolvers");
const invoices_service_1 = require("./services/invoices.service");
const invoice_entity_1 = require("./entities/invoice.entity");
const histories_service_1 = require("./services/histories.service");
const history_entity_1 = require("./entities/history.entity");
const transactions_service_1 = require("./services/transactions.service");
const transactions_resolvers_1 = require("./resolvers/transactions.resolvers");
const balances_service_1 = require("./services/balances.service");
const balances_resolvers_1 = require("./resolvers/balances.resolvers");
const beneficiaries_resolvers_1 = require("./resolvers/beneficiaries.resolvers");
const payment_entity_1 = require("./entities/payment.entity");
const iban_entity_1 = require("./entities/iban.entity");
const payments_service_1 = require("./services/payments.service");
const ibans_service_1 = require("./services/ibans.service");
const payments_resolvers_1 = require("./resolvers/payments.resolvers");
const token_generator_service_1 = require("./services/token-generator.service");
const payment_repository_1 = require("./repositories/payment.repository");
const webhook_entity_1 = require("./entities/webhook.entity");
const webhooks_service_1 = require("./services/webhooks.service");
const treezor_controller_1 = require("./controllers/treezor.controller");
const payment_notification_entity_1 = require("./entities/payment-notification.entity");
const accounting_preferences_resolvers_1 = require("./resolvers/accounting-preferences.resolvers");
const accounting_preferences_service_1 = require("./services/accounting-preferences.service");
const accounting_preference_entity_1 = require("./entities/accounting-preference.entity");
const exports_service_1 = require("./services/exports.service");
const accounting_entry_repository_1 = require("./repositories/accounting-entry.repository");
const export_entity_1 = require("./entities/export.entity");
const accounting_entry_entity_1 = require("./entities/accounting-entry.entity");
const exports_resolvers_1 = require("./resolvers/exports.resolvers");
const ibans_resolvers_1 = require("./resolvers/ibans.resolvers");
const bank_accounts_resolvers_1 = require("./resolvers/bank-accounts.resolvers");
const bank_account_service_1 = require("./services/bank-account.service");
const bank_account_entity_1 = require("./entities/bank-account.entity");
const mandate_entity_1 = require("./entities/mandate.entity");
const mandates_resolvers_1 = require("./resolvers/mandates.resolvers");
const mandates_service_1 = require("./services/mandates.service");
const mandate_repository_1 = require("./repositories/mandate.repository");
const notification_module_1 = require("../notification/notification.module");
const siren_module_1 = require("../siren/siren.module");
const payment_module_1 = require("../payment/payment.module");
const payments_workflow_1 = require("./workflow/payments.workflow");
const payins_service_1 = require("./services/payins.service");
const payin_entity_1 = require("./entities/payin.entity");
const storage_module_1 = require("../storage/storage.module");
const treezor_payout_workflow_1 = require("./workflow/treezor-payout.workflow");
let CommonModule = class CommonModule {
};
CommonModule = __decorate([
    common_1.Module({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([
                partner_entity_1.Partner,
                company_entity_1.Company,
                user_entity_1.User,
                email_entity_1.Email,
                address_entity_1.Address,
                contact_entity_1.Contact,
                invoice_entity_1.Invoice,
                history_entity_1.History,
                payment_entity_1.Payment,
                iban_entity_1.Iban,
                webhook_entity_1.Webhook,
                accounting_preference_entity_1.AccountingPreference,
                payment_notification_entity_1.PaymentNotification,
                export_entity_1.Export,
                accounting_entry_entity_1.AccountingEntry,
                bank_account_entity_1.BankAccount,
                mandate_entity_1.Mandate,
                payin_entity_1.Payin,
                payment_repository_1.PaymentRepository,
                accounting_entry_repository_1.AccountingEntryRepository,
                mandate_repository_1.MandateRepository,
            ]),
            notification_module_1.NotificationModule,
            siren_module_1.SirenModule,
            payment_module_1.PaymentModule,
            storage_module_1.StorageModule,
        ],
        providers: [
            date_scalar_1.DateScalar,
            addresses_resolvers_1.AddressesResolvers,
            balances_resolvers_1.BalancesResolver,
            companies_resolvers_1.CompaniesResolvers,
            contacts_resolvers_1.ContactsResolvers,
            emails_resolvers_1.EmailsResolvers,
            invoices_resolvers_1.InvoicesResolvers,
            partners_resolvers_1.PartnersResolvers,
            transactions_resolvers_1.TransactionsResolver,
            users_resolvers_1.UsersResolvers,
            beneficiaries_resolvers_1.BeneficiariesResolvers,
            payments_resolvers_1.PaymentsResolvers,
            accounting_preferences_resolvers_1.AccountingPreferencesResolvers,
            exports_resolvers_1.ExportsResolvers,
            ibans_resolvers_1.IbansResolvers,
            bank_accounts_resolvers_1.BankAccountResolver,
            mandates_resolvers_1.MandatesResolvers,
            addresses_service_1.AddressesService,
            balances_service_1.BalancesService,
            companies_service_1.CompaniesService,
            contacts_service_1.ContactsService,
            emails_service_1.EmailsService,
            histories_service_1.HistoriesService,
            invoices_service_1.InvoicesService,
            partners_service_1.PartnersService,
            transactions_service_1.TransactionsService,
            users_service_1.UsersService,
            payments_service_1.PaymentsService,
            ibans_service_1.IbansService,
            token_generator_service_1.TokenGeneratorService,
            webhooks_service_1.WebhooksService,
            accounting_preferences_service_1.AccountingPreferencesService,
            exports_service_1.ExportsService,
            bank_account_service_1.BankAccountService,
            mandates_service_1.MandatesService,
            payins_service_1.PayinsService,
            common_1.Logger,
            payments_workflow_1.PaymentsWorkflow,
            treezor_payout_workflow_1.TreezorPayoutWorkflow
        ],
        controllers: [
            treezor_controller_1.TreezorController,
        ],
    })
], CommonModule);
exports.CommonModule = CommonModule;
//# sourceMappingURL=common.module.js.map