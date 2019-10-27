"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
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
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const payment_entity_1 = require("../entities/payment.entity");
const invoices_service_1 = require("./invoices.service");
const company_entity_1 = require("../entities/company.entity");
const invoice_entity_1 = require("../entities/invoice.entity");
const balances_service_1 = require("./balances.service");
const treezor_service_1 = require("../../payment/treezor.service");
const nest_schedule_1 = require("nest-schedule");
const payment_repository_1 = require("../repositories/payment.repository");
const typeorm_2 = require("typeorm");
const contacts_service_1 = require("./contacts.service");
const payment_notification_entity_1 = require("../entities/payment-notification.entity");
const payments_workflow_1 = require("../workflow/payments.workflow");
const zendesk_service_1 = require("../../notification/zendesk.service");
const zendesk_ticket_interface_1 = require("../../notification/interface/zendesk-ticket.interface");
const payin_entity_1 = require("../entities/payin.entity");
let PaymentsService = class PaymentsService extends nest_schedule_1.NestSchedule {
    constructor(paymentRepository, invoiceRepository, paymentNotificationRepository, invoicesService, balancesService, contactsService, treezorService, paymentsWorkflow, zendeskService) {
        super();
        this.paymentRepository = paymentRepository;
        this.invoiceRepository = invoiceRepository;
        this.paymentNotificationRepository = paymentNotificationRepository;
        this.invoicesService = invoicesService;
        this.balancesService = balancesService;
        this.contactsService = contactsService;
        this.treezorService = treezorService;
        this.paymentsWorkflow = paymentsWorkflow;
        this.zendeskService = zendeskService;
    }
    payoutContacts(user, invoiceId, contactIds) {
        return __awaiter(this, void 0, void 0, function* () {
            const invoice = yield this.invoicesService.findOneByIdAndCurrentCompany(invoiceId, user.currentCompany);
            if (!invoice) {
                throw new common_1.HttpException('api.error.invoice.not_found', common_1.HttpStatus.NOT_FOUND);
            }
            const contacts = yield this.contactsService.findByCompanyAndIds(invoice.companyEmitter, contactIds, user.currentCompany);
            if (contacts.length === 0) {
                return false;
            }
            yield Promise.all(contacts.map((contact) => __awaiter(this, void 0, void 0, function* () {
                const paymentNotification = this.paymentNotificationRepository.create({
                    contact,
                    invoice,
                    createdBy: user,
                });
                yield paymentNotification.save();
            })));
            return true;
        });
    }
    payout(user, invoiceId, date, code) {
        return __awaiter(this, void 0, void 0, function* () {
            const invoice = yield this.invoicesService.findOneByIdAndCurrentCompany(invoiceId, user.currentCompany);
            if (invoice.status !== invoice_entity_1.InvoiceStatus.TO_PAY) {
                throw new common_1.HttpException('api.error.invoice.invalid_status', common_1.HttpStatus.BAD_REQUEST);
            }
            if ((invoice.code && !invoice.codeValidatedBy) || code) {
                yield this.invoicesService.checkCode(invoiceId, code);
            }
            const payment = this.paymentRepository.create({
                treezorPayerWalletId: invoice.companyReceiver.treezorWalletId,
                status: payment_entity_1.PaymentStatus.REQUESTED,
                amount: invoice.total,
                currency: invoice.currency,
                invoice,
                paymentAt: (date) ? new Date(date) : new Date(),
                paymentRequestUser: user,
                libeoEstimatedBalance: 0,
            });
            invoice.status = invoice_entity_1.InvoiceStatus.PLANNED;
            if (invoice.iban && invoice.iban.treezorBeneficiaryId) {
                payment.treezorBeneficiaryId = invoice.iban.treezorBeneficiaryId;
            }
            yield Promise.all([
                payment.save(),
                invoice.save(),
            ]);
            yield this.updateLibeoBalance(invoice.companyReceiver, payment);
            if (invoice.iban && !invoice.iban.treezorBeneficiaryId) {
                yield this.createBeneficiary(user, invoice, payment);
            }
            const invoices = yield this.invoiceRepository
                .find({
                where: {
                    companyReceiver: user.currentCompany,
                    status: typeorm_2.In([invoice_entity_1.InvoiceStatus.TO_PAY, invoice_entity_1.InvoiceStatus.PLANNED])
                }
            });
            return invoices;
        });
    }
    createBeneficiary(user, invoice, payment) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const beneficiary = yield this.treezorService.createBeneficiary({
                    body: {
                        tag: invoice.iban.id,
                        userId: invoice.companyReceiver.treezorUserId,
                        nickName: invoice.companyReceiver.name + ' -> ' + invoice.companyEmitter.name,
                        name: invoice.companyEmitter.name,
                        iban: invoice.iban.iban,
                        bic: invoice.iban.bic,
                        usableForSct: true,
                    },
                });
                const iban = invoice.iban;
                iban.treezorBeneficiaryId = beneficiary.id;
                yield iban.save();
                if (payment) {
                    payment.treezorBeneficiaryId = beneficiary.id;
                    yield payment.save();
                }
                return beneficiary;
            }
            catch (err) {
                if (err.code === 75001) {
                    invoice.status = invoice_entity_1.InvoiceStatus.TO_PAY;
                    payment.status = payment_entity_1.PaymentStatus.CANCELLED;
                    payment.cancellationRequestAt = new Date();
                    payment.cancellationRequestUser = null;
                    try {
                        yield Promise.all([invoice.save(), payment.save()]);
                        yield this.zendeskService.createTicket({
                            type: zendesk_ticket_interface_1.ZendeskTicketType.PROBLEM,
                            priority: zendesk_ticket_interface_1.ZendesTicketPriority.HIGH,
                            requester: { name: user.fullName || null, email: user.email || null },
                            subject: 'IBAN non valide',
                            comment: { body: `L'IBAN renseigné par l'entreprise ${invoice.companyReceiver.name || invoice.companyReceiver.brandName || ''} est invalide. Le bénéficiaire n'a pas pu être créé chez Treezor, la facture et le paiement associé sont donc annulés : \n* Iban ID : ${invoice.iban.id}\n* Payement ID : ${payment.id}\n* Invoice ID ${invoice.id}` },
                        });
                        throw new common_1.HttpException('api.error.invoice.iban', common_1.HttpStatus.BAD_REQUEST);
                    }
                    catch (err) {
                        throw new common_1.HttpException(err.message, err.statusCode);
                    }
                }
                else {
                    throw new common_1.HttpException(err.message, err.statusCode);
                }
            }
        });
    }
    checkKyc(company) {
        return __awaiter(this, void 0, void 0, function* () {
            const treezorStatuses = [company_entity_1.CompanyKycStatus.PENDING, company_entity_1.CompanyKycStatus.REFUSED, company_entity_1.CompanyKycStatus.VALIDATED];
            if (treezorStatuses.indexOf(company.kycStatus) === -1) {
                return false;
            }
            return true;
        });
    }
    findOneByInvoice(invoice) {
        return __awaiter(this, void 0, void 0, function* () {
            const payment = yield this.paymentRepository.findOne({ invoice });
            if (!payment) {
                throw new common_1.HttpException('api.error.payment.not_found', common_1.HttpStatus.NOT_FOUND);
            }
            return payment;
        });
    }
    updateLibeoBalance(company, currentPayment) {
        return __awaiter(this, void 0, void 0, function* () {
            const [balance, payments] = yield Promise.all([
                this.balancesService.getBalance(company),
                this.paymentRepository.getPlannedPayments(company, (currentPayment) ? currentPayment.paymentAt : null),
            ]);
            if (!balance) {
                return;
            }
            let calculationLibeoBalance = Number(balance.authorizedBalance);
            if (currentPayment) {
                calculationLibeoBalance = yield this.balancesService.calculationLibeoBalance(balance, currentPayment.paymentAt, company);
                currentPayment.libeoEstimatedBalance = calculationLibeoBalance;
                yield currentPayment.save();
                if (calculationLibeoBalance < 0) {
                    return;
                }
            }
            try {
                yield Promise.all(payments.map((payment) => {
                    payment.libeoEstimatedBalance = calculationLibeoBalance - payment.amount;
                    if (payment.libeoEstimatedBalance > 0) {
                        calculationLibeoBalance = payment.libeoEstimatedBalance;
                    }
                    return payment.save();
                }));
            }
            catch (err) {
                throw new common_1.HttpException(err.message, common_1.HttpStatus.BAD_REQUEST);
            }
        });
    }
    checkBeneficiary(beneficiaryId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const beneficiary = yield this.treezorService.getBeneficiary(beneficiaryId);
                if (beneficiary) {
                    return true;
                }
            }
            catch (err) {
                throw new common_1.HttpException(err.message, err.statusCode);
            }
            return false;
        });
    }
    deferredPayments() {
        return __awaiter(this, void 0, void 0, function* () {
            const logger = new common_1.Logger();
            const payments = yield this.paymentRepository.getDeferredPayments();
            if (payments.length === 0) {
                return;
            }
            else {
                logger.log(`${payments.length} deferred payments`);
            }
            yield Promise.all(payments.map(this.paymentsWorkflow.processPayment));
        });
    }
    updateInvoiceStatus(id, status, user) {
        return __awaiter(this, void 0, void 0, function* () {
            const invoice = yield this.invoiceRepository.findOne({ id });
            if (!invoice) {
                throw new common_1.HttpException('api.error.invoice.not_found', common_1.HttpStatus.NOT_FOUND);
            }
            if (invoice.status === invoice_entity_1.InvoiceStatus.PAID) {
                throw new common_1.HttpException('api.error.invoice.already_paid', common_1.HttpStatus.BAD_REQUEST);
            }
            if (status === invoice_entity_1.InvoiceStatus.TO_PAY && invoice.status === invoice_entity_1.InvoiceStatus.PLANNED) {
                const payments = yield this.paymentRepository.find({
                    where: {
                        invoice,
                        status: typeorm_2.In([
                            payment_entity_1.PaymentStatus.REQUESTED,
                            payment_entity_1.PaymentStatus.BEING_PROCESSED,
                            payment_entity_1.PaymentStatus.TREEZOR_PENDING,
                            payment_entity_1.PaymentStatus.TREEZOR_SYNC_KO_NOT_ENOUGH_BALANCE,
                            payment_entity_1.PaymentStatus.TREEZOR_SYNC_KO_MISC,
                            payment_entity_1.PaymentStatus.TREEZOR_WH_KO_MISC,
                            payment_entity_1.PaymentStatus.TREEZOR_WH_KO_NOT_ENOUGH_BALANCE,
                        ]),
                    },
                    relations: ['payin'],
                });
                const promises = payments.map((payment) => __awaiter(this, void 0, void 0, function* () {
                    payment.status = payment_entity_1.PaymentStatus.CANCELLED;
                    payment.cancellationRequestAt = new Date();
                    payment.cancellationRequestUser = user;
                    yield payment.save();
                    if (payment.payin) {
                        const payin = payment.payin;
                        payin.status = payin_entity_1.PayinStatus.CANCELLED;
                        yield payin.save();
                        if (payin.treezorPayinId) {
                            try {
                                yield this.treezorService.deletePayin(payin.treezorPayinId);
                            }
                            catch (err) {
                                throw new common_1.HttpException(err.message, err.statusCode);
                            }
                        }
                    }
                    if (payment.treezorPayoutId) {
                        try {
                            yield this.treezorService.deletePayout(payment.treezorPayoutId);
                        }
                        catch (err) {
                            throw new common_1.HttpException(err.message, err.statusCode);
                        }
                    }
                }));
                yield Promise.all(promises);
                yield this.updateLibeoBalance(invoice.companyReceiver);
            }
            if (status === invoice_entity_1.InvoiceStatus.SCANNED && invoice.status === invoice_entity_1.InvoiceStatus.TO_PAY) {
                invoice.code = null;
                invoice.codeValidatedAt = null;
                invoice.codeValidatedBy = null;
            }
            invoice.status = status;
            yield invoice.save();
            if (status === invoice_entity_1.InvoiceStatus.TO_PAY) {
                const invoices = yield this.invoiceRepository
                    .find({
                    where: {
                        companyReceiver: user.currentCompany,
                        status: typeorm_2.In([invoice_entity_1.InvoiceStatus.PLANNED])
                    }
                });
                return invoices.concat(invoice);
            }
            return [invoice];
        });
    }
};
__decorate([
    nest_schedule_1.Cron('* * * * *'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PaymentsService.prototype, "deferredPayments", null);
PaymentsService = __decorate([
    common_1.Injectable(),
    __param(0, typeorm_1.InjectRepository(payment_repository_1.PaymentRepository)),
    __param(1, typeorm_1.InjectRepository(invoice_entity_1.Invoice)),
    __param(2, typeorm_1.InjectRepository(payment_notification_entity_1.PaymentNotification)),
    __metadata("design:paramtypes", [payment_repository_1.PaymentRepository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        invoices_service_1.InvoicesService,
        balances_service_1.BalancesService,
        contacts_service_1.ContactsService,
        treezor_service_1.TreezorService,
        payments_workflow_1.PaymentsWorkflow,
        zendesk_service_1.ZendeskService])
], PaymentsService);
exports.PaymentsService = PaymentsService;
//# sourceMappingURL=payments.service.js.map