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
const Zendesk = require("zendesk-node-api");
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
const constants_1 = require("../../constants");
const payment_notification_entity_1 = require("../entities/payment-notification.entity");
let PaymentsService = class PaymentsService extends nest_schedule_1.NestSchedule {
    constructor(paymentRepository, invoiceRepository, companyRepository, paymentNotificationRepository, invoicesService, balancesService, contactsService) {
        super();
        this.paymentRepository = paymentRepository;
        this.invoiceRepository = invoiceRepository;
        this.companyRepository = companyRepository;
        this.paymentNotificationRepository = paymentNotificationRepository;
        this.invoicesService = invoicesService;
        this.balancesService = balancesService;
        this.contactsService = contactsService;
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
            const To = [];
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
            this.updateLibeoBalance(invoice.companyReceiver, payment);
            if (invoice.iban && !invoice.iban.treezorBeneficiaryId) {
                yield this.createBeneficiary(user, invoice, payment);
            }
            return invoice;
        });
    }
    createBeneficiary(user, invoice, payment) {
        return __awaiter(this, void 0, void 0, function* () {
            const treezor = new treezor_service_1.TreezorService({
                baseUrl: process.env.TREEZOR_API_URL,
                token: process.env.TREEZOR_TOKEN,
                secretKey: process.env.TREEZOR_SECRET_KEY,
                userId: invoice.companyEmitter.treezorUserId,
            });
            try {
                const beneficiary = yield treezor.createBeneficiary({
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
                        const zendesk = new Zendesk({
                            url: process.env.ZENDESK_API_URL,
                            email: process.env.ZENDESK_API_EMAIL,
                            token: process.env.ZENDESK_API_TOKEN,
                        });
                        zendesk.tickets.create({
                            type: 'problem',
                            priority: 'high',
                            requester: { name: user.fullName || null, email: user.email || null },
                            subject: 'IBAN non valide',
                            comment: { body: `L'IBAN renseigné par l'entreprise ${invoice.companyReceiver.name || invoice.companyReceiver.brandName || ''} est invalide. Le bénéficiaire n'a pas pu être créé chez Treezor, la facture et le paiement associé sont donc annulés : \n* Iban ID : ${invoice.iban.id}\n* Payement ID : ${payment.id}\n* Invoice ID ${invoice.id}` },
                            custom_fields: [constants_1.environmentZendesk],
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
            const treezor = new treezor_service_1.TreezorService({
                baseUrl: process.env.TREEZOR_API_URL,
                token: process.env.TREEZOR_TOKEN,
                secretKey: process.env.TREEZOR_SECRET_KEY,
            });
            try {
                const beneficiary = yield treezor.getBeneficiary(beneficiaryId);
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
            const payments = yield this.paymentRepository.getDeferredPayments([
                payment_entity_1.PaymentStatus.REQUESTED,
                payment_entity_1.PaymentStatus.TREEZOR_SYNC_KO_NOT_ENOUGH_BALANCE,
                payment_entity_1.PaymentStatus.TREEZOR_SYNC_KO_MISC,
                payment_entity_1.PaymentStatus.TREEZOR_WH_KO_NOT_ENOUGH_BALANCE,
                payment_entity_1.PaymentStatus.TREEZOR_WH_KO_MISC,
            ]);
            logger.log(`${payments.length} deferred payments`);
            if (payments.length === 0) {
                return;
            }
            const treezor = new treezor_service_1.TreezorService({
                baseUrl: process.env.TREEZOR_API_URL,
                token: process.env.TREEZOR_TOKEN,
                secretKey: process.env.TREEZOR_SECRET_KEY,
            });
            yield Promise.all(payments.map((payment) => __awaiter(this, void 0, void 0, function* () {
                payment.status = payment_entity_1.PaymentStatus.SENT_TO_TREEZOR;
                try {
                    yield payment.save();
                }
                catch (err) {
                    logger.error(err.message);
                }
                try {
                    const payout = yield treezor.createPayout({
                        beneficiaryId: payment.treezorBeneficiaryId,
                        amount: payment.invoice.total,
                        currency: payment.invoice.currency,
                        walletId: payment.invoice.companyReceiver.treezorWalletId,
                        payoutTag: payment.id,
                        label: payment.invoice.companyReceiver.name || payment.invoice.companyReceiver.brandName || '',
                        supportingFileLink: (payment.amount > 2000) ? payment.invoice.filepath : '',
                    });
                    payment.treezorPayoutId = payout.payoutId;
                    payment.treezorRequestAt = new Date();
                    payment.status = payment_entity_1.PaymentStatus.TREEZOR_PENDING;
                    yield payment.save();
                    logger.log(`Payment ${payment.id} passed`);
                }
                catch (err) {
                    logger.error(err.message);
                    if (err.code === 16018) {
                        payment.status = payment_entity_1.PaymentStatus.TREEZOR_SYNC_KO_NOT_ENOUGH_BALANCE;
                    }
                    else {
                        payment.status = payment_entity_1.PaymentStatus.TREEZOR_SYNC_KO_MISC;
                    }
                    payment.treezorRequestAt = new Date();
                    yield payment.save();
                    yield this.updateLibeoBalance(payment.invoice.companyReceiver, payment);
                    const companyReceiver = yield this.companyRepository.findOne({ where: { id: payment.invoice.companyReceiver.id }, relations: ['claimer'] });
                    const claimer = companyReceiver.claimer;
                    const zendesk = new Zendesk({
                        url: process.env.ZENDESK_API_URL,
                        email: process.env.ZENDESK_API_EMAIL,
                        token: process.env.ZENDESK_API_TOKEN,
                    });
                    zendesk.tickets.create({
                        type: 'incident',
                        priority: 'urgent',
                        requester: { name: claimer.fullName || null, email: claimer.email || null },
                        subject: 'Paiement en erreur',
                        comment: { body: `Le paiement ${payment.id} est retourné en erreur par treezor et demande une investiguation.\nLe paiement sera retenté automatiquement.\nMessage d'erreur : ${err.message}` },
                        custom_fields: [constants_1.environmentZendesk],
                    });
                }
            })));
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
                    invoice,
                    status: typeorm_2.In([
                        payment_entity_1.PaymentStatus.REQUESTED,
                        payment_entity_1.PaymentStatus.SENT_TO_TREEZOR,
                        payment_entity_1.PaymentStatus.TREEZOR_PENDING,
                        payment_entity_1.PaymentStatus.TREEZOR_SYNC_KO_NOT_ENOUGH_BALANCE,
                        payment_entity_1.PaymentStatus.TREEZOR_SYNC_KO_MISC,
                        payment_entity_1.PaymentStatus.TREEZOR_WH_KO_MISC,
                        payment_entity_1.PaymentStatus.TREEZOR_WH_KO_NOT_ENOUGH_BALANCE,
                    ]),
                });
                const promises = payments.map((payment) => __awaiter(this, void 0, void 0, function* () {
                    payment.status = payment_entity_1.PaymentStatus.CANCELLED;
                    payment.cancellationRequestAt = new Date();
                    payment.cancellationRequestUser = user;
                    yield payment.save();
                    if (payment.treezorPayoutId) {
                        const treezor = new treezor_service_1.TreezorService({
                            baseUrl: process.env.TREEZOR_API_URL,
                            token: process.env.TREEZOR_TOKEN,
                            secretKey: process.env.TREEZOR_SECRET_KEY,
                        });
                        try {
                            yield treezor.deletePayout(payment.treezorPayoutId);
                        }
                        catch (err) {
                            throw new common_1.HttpException(err.message, err.statusCode);
                        }
                    }
                }));
                yield Promise.all(promises);
                this.updateLibeoBalance(invoice.companyReceiver);
            }
            if (status === invoice_entity_1.InvoiceStatus.SCANNED && invoice.status === invoice_entity_1.InvoiceStatus.TO_PAY) {
                invoice.code = null;
                invoice.codeValidatedAt = null;
                invoice.codeValidatedBy = null;
            }
            invoice.status = status;
            yield invoice.save();
            return invoice;
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
    __param(2, typeorm_1.InjectRepository(company_entity_1.Company)),
    __param(3, typeorm_1.InjectRepository(payment_notification_entity_1.PaymentNotification)),
    __metadata("design:paramtypes", [payment_repository_1.PaymentRepository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        invoices_service_1.InvoicesService,
        balances_service_1.BalancesService,
        contacts_service_1.ContactsService])
], PaymentsService);
exports.PaymentsService = PaymentsService;
//# sourceMappingURL=payments.service.js.map