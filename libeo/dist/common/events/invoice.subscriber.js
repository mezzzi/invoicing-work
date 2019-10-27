"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const contextService = require("request-context");
const typeorm_1 = require("typeorm");
const invoice_entity_1 = require("../entities/invoice.entity");
const histories_service_1 = require("../services/histories.service");
const history_entity_1 = require("../entities/history.entity");
const histories_dto_1 = require("../dto/histories.dto");
const common_1 = require("@nestjs/common");
const payment_entity_1 = require("../entities/payment.entity");
const accounting_entry_entity_1 = require("../entities/accounting-entry.entity");
const accounting_preference_entity_1 = require("../entities/accounting-preference.entity");
let InvoiceSubscriber = class InvoiceSubscriber {
    checkStatusChange(event) {
        const validatedStatuses = {};
        validatedStatuses[invoice_entity_1.InvoiceStatus.IMPORTING] = [invoice_entity_1.InvoiceStatus.IMPORTED];
        validatedStatuses[invoice_entity_1.InvoiceStatus.IMPORTED] = [invoice_entity_1.InvoiceStatus.SCANNING];
        validatedStatuses[invoice_entity_1.InvoiceStatus.SCANNING] = [invoice_entity_1.InvoiceStatus.SCANNED];
        validatedStatuses[invoice_entity_1.InvoiceStatus.SCANNED] = [invoice_entity_1.InvoiceStatus.TO_PAY];
        validatedStatuses[invoice_entity_1.InvoiceStatus.TO_PAY] = [invoice_entity_1.InvoiceStatus.SCANNED, invoice_entity_1.InvoiceStatus.PLANNED];
        validatedStatuses[invoice_entity_1.InvoiceStatus.PLANNED] = [invoice_entity_1.InvoiceStatus.TO_PAY, invoice_entity_1.InvoiceStatus.PAID];
        validatedStatuses[invoice_entity_1.InvoiceStatus.PAID] = [];
        if (validatedStatuses[event.databaseEntity.status].indexOf(event.entity.status) === -1) {
            throw new common_1.HttpException('api.error.invoice.status', common_1.HttpStatus.BAD_REQUEST);
        }
    }
    createHistory(event, user) {
        return __awaiter(this, void 0, void 0, function* () {
            const historiesService = new histories_service_1.HistoriesService(typeorm_1.getRepository('History'));
            const params = { status: event.entity.status, oldStatus: event.databaseEntity.status };
            if (event.entity.status === invoice_entity_1.InvoiceStatus.PLANNED) {
                const payment = yield typeorm_1.getRepository(payment_entity_1.Payment).findOne({ where: { status: payment_entity_1.PaymentStatus.REQUESTED, invoice: { id: event.databaseEntity.id } }, order: { id: 'DESC' } });
                if (payment) {
                    params.paymentAt = payment.paymentAt;
                    params.libeoEstimatedBalance = payment.libeoEstimatedBalance;
                }
            }
            yield historiesService.createHistory({
                user,
                params,
                entity: history_entity_1.HistoryEntity.INVOICE,
                entityId: event.databaseEntity.id,
                event: histories_dto_1.HistoryEvent.UPDATE_STATUS,
            });
        });
    }
    cancelPayments(event, user) {
        return __awaiter(this, void 0, void 0, function* () {
            if (event.entity.status === invoice_entity_1.InvoiceStatus.TO_PAY && event.databaseEntity.status === invoice_entity_1.InvoiceStatus.PLANNED) {
                const payments = yield typeorm_1.getRepository(payment_entity_1.Payment).find({
                    invoice: event.databaseEntity,
                    status: typeorm_1.In([
                        payment_entity_1.PaymentStatus.REQUESTED,
                        payment_entity_1.PaymentStatus.BEING_PROCESSED,
                        payment_entity_1.PaymentStatus.TREEZOR_PENDING,
                        payment_entity_1.PaymentStatus.TREEZOR_SYNC_KO_NOT_ENOUGH_BALANCE,
                        payment_entity_1.PaymentStatus.TREEZOR_SYNC_KO_MISC,
                        payment_entity_1.PaymentStatus.TREEZOR_WH_KO_MISC,
                        payment_entity_1.PaymentStatus.TREEZOR_WH_KO_NOT_ENOUGH_BALANCE,
                    ]),
                });
                payments.forEach(payment => {
                    payment.status = payment_entity_1.PaymentStatus.CANCELLED;
                    payment.cancellationRequestAt = new Date();
                    payment.cancellationRequestUser = user;
                    payment.save();
                });
            }
        });
    }
    accountingEntry(invoice) {
        return __awaiter(this, void 0, void 0, function* () {
            if (invoice.status !== invoice_entity_1.InvoiceStatus.PAID) {
                return;
            }
            const entries = [];
            let ledgerPurchase;
            let ledgerBank;
            let vatAccount;
            let vendorAccount;
            let bankAccount;
            let payment;
            try {
                [ledgerPurchase, ledgerBank, vatAccount, vendorAccount, bankAccount, payment] = yield Promise.all([
                    typeorm_1.getRepository(accounting_preference_entity_1.AccountingPreference).findOne({ type: accounting_preference_entity_1.AccountingPreferenceType.LEDGER_PURCHASE, company: invoice.companyReceiver }),
                    typeorm_1.getRepository(accounting_preference_entity_1.AccountingPreference).findOne({ type: accounting_preference_entity_1.AccountingPreferenceType.LEDGER_BANK, company: invoice.companyReceiver }),
                    typeorm_1.getRepository(accounting_preference_entity_1.AccountingPreference).findOne({ type: accounting_preference_entity_1.AccountingPreferenceType.VAT_ACCOUNT, company: invoice.companyReceiver }),
                    typeorm_1.getRepository(accounting_preference_entity_1.AccountingPreference).findOne({ type: accounting_preference_entity_1.AccountingPreferenceType.VENDOR_ACCOUNT, company: invoice.companyReceiver }),
                    typeorm_1.getRepository(accounting_preference_entity_1.AccountingPreference).findOne({ type: accounting_preference_entity_1.AccountingPreferenceType.BANK_ACCOUNT, company: invoice.companyReceiver }),
                    typeorm_1.getRepository(payment_entity_1.Payment).findOne({ invoice: { id: invoice.id }, status: payment_entity_1.PaymentStatus.TREEZOR_WH_VALIDATED }),
                ]);
            }
            catch (err) {
                throw new common_1.HttpException('api.error.invoice.accounting_entries', common_1.HttpStatus.BAD_REQUEST);
            }
            if (ledgerPurchase && ledgerBank) {
                entries.push({
                    entryDate: invoice.invoiceDate,
                    ledger: ledgerPurchase,
                    account: vendorAccount,
                    entryLabel: invoice.companyEmitter.name,
                    postingType: accounting_entry_entity_1.AccountingEntryPostingType.CREDIT,
                    entryAmount: invoice.total,
                    entryRef: invoice.number,
                    entryCurrency: invoice.currency,
                    entryType: accounting_entry_entity_1.AccountingEntryType.INVOICE,
                    company: invoice.companyReceiver,
                }, {
                    entryDate: invoice.invoiceDate,
                    ledger: ledgerPurchase,
                    account: vatAccount,
                    entryLabel: invoice.companyEmitter.name,
                    postingType: accounting_entry_entity_1.AccountingEntryPostingType.DEBIT,
                    entryAmount: invoice.total - invoice.totalWoT,
                    entryRef: invoice.number,
                    entryCurrency: invoice.currency,
                    entryType: accounting_entry_entity_1.AccountingEntryType.INVOICE,
                    company: invoice.companyReceiver,
                }, {
                    entryDate: invoice.invoiceDate,
                    ledger: ledgerPurchase,
                    account: invoice.purchaseAccount,
                    entryLabel: invoice.companyEmitter.name,
                    postingType: accounting_entry_entity_1.AccountingEntryPostingType.CREDIT,
                    entryAmount: invoice.totalWoT,
                    entryRef: invoice.number,
                    entryCurrency: invoice.currency,
                    entryType: accounting_entry_entity_1.AccountingEntryType.INVOICE,
                    company: invoice.companyReceiver,
                });
            }
            if (bankAccount && payment) {
                entries.push({
                    entryDate: payment.treezorValidationAt,
                    ledger: ledgerBank,
                    account: vendorAccount,
                    entryLabel: invoice.companyEmitter.name,
                    postingType: accounting_entry_entity_1.AccountingEntryPostingType.DEBIT,
                    entryAmount: invoice.totalWoT,
                    entryRef: invoice.number,
                    entryCurrency: invoice.currency,
                    entryType: accounting_entry_entity_1.AccountingEntryType.PAYMENT,
                    company: invoice.companyReceiver,
                }, {
                    entryDate: payment.treezorValidationAt,
                    ledger: ledgerBank,
                    account: bankAccount,
                    entryLabel: invoice.companyEmitter.name,
                    postingType: accounting_entry_entity_1.AccountingEntryPostingType.CREDIT,
                    entryAmount: invoice.totalWoT,
                    entryRef: invoice.number,
                    entryCurrency: invoice.currency,
                    entryType: accounting_entry_entity_1.AccountingEntryType.PAYMENT,
                    company: invoice.companyReceiver,
                });
            }
            if (entries.length > 0) {
                yield typeorm_1.getRepository(accounting_entry_entity_1.AccountingEntry).insert(entries);
            }
        });
    }
    listenTo() {
        return invoice_entity_1.Invoice;
    }
    beforeUpdate(event) {
        if (event.entity.status !== event.databaseEntity.status) {
            this.checkStatusChange(event);
        }
    }
    afterUpdate(event) {
        return __awaiter(this, void 0, void 0, function* () {
            if (event.entity.status !== event.databaseEntity.status) {
                const user = contextService.get('request:user');
                yield this.createHistory(event, user);
                yield this.accountingEntry(event.entity);
            }
        });
    }
};
InvoiceSubscriber = __decorate([
    typeorm_1.EventSubscriber()
], InvoiceSubscriber);
exports.InvoiceSubscriber = InvoiceSubscriber;
//# sourceMappingURL=invoice.subscriber.js.map