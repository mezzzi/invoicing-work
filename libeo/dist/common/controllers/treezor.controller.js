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
const typeorm_1 = require("typeorm");
const common_1 = require("@nestjs/common");
const typeorm_2 = require("@nestjs/typeorm");
const webhooks_service_1 = require("../services/webhooks.service");
const payments_service_1 = require("../services/payments.service");
const payment_entity_1 = require("../entities/payment.entity");
const invoice_entity_1 = require("../entities/invoice.entity");
const company_entity_1 = require("../entities/company.entity");
const payment_repository_1 = require("../repositories/payment.repository");
const treezor_service_1 = require("../../payment/treezor.service");
const constants_1 = require("../../constants");
const bank_account_service_1 = require("../services/bank-account.service");
let TreezorController = class TreezorController {
    constructor(companyRepository, paymentRepository, webhooksService, paymentsService, bankAccountService) {
        this.companyRepository = companyRepository;
        this.paymentRepository = paymentRepository;
        this.webhooksService = webhooksService;
        this.paymentsService = paymentsService;
        this.bankAccountService = bankAccountService;
    }
    webhook(res, body) {
        return __awaiter(this, void 0, void 0, function* () {
            const webhook = yield this.webhooksService.updateWebhook({ objectId: body.object_id, objectPayload: null }, body);
            const treezor = new treezor_service_1.TreezorService({
                baseUrl: process.env.TREEZOR_API_URL,
                token: process.env.TREEZOR_TOKEN,
                secretKey: process.env.TREEZOR_SECRET_KEY,
            });
            if (webhook.object === 'payout') {
                const { payouts } = webhook.objectPayload;
                const [payout] = payouts;
                if (payout.payoutStatus === 'VALIDATED' || payout.payoutStatus === 'CANCELED') {
                    const payment = yield this.paymentRepository.findOne({ where: { treezorPayoutId: webhook.objectId }, relations: ['invoice'] });
                    if (payment) {
                        const companyReceiver = yield this.companyRepository.findOne({ where: { id: payment.invoice.companyReceiver.id }, relations: ['claimer'] });
                        const claimer = companyReceiver.claimer;
                        if (payout.payoutStatus === 'VALIDATED') {
                            payment.treezorValidationAt = new Date();
                            payment.status = payment_entity_1.PaymentStatus.TREEZOR_WH_VALIDATED;
                            const invoice = payment.invoice;
                            invoice.status = invoice_entity_1.InvoiceStatus.PAID;
                            yield Promise.all([payment.save(), invoice.save()]);
                        }
                        if (payout.payoutStatus === 'CANCELED' && payment.status !== payment_entity_1.PaymentStatus.CANCELLED) {
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
                                comment: { body: `Le paiement ${webhook.objectId} a été envoyé sans solde à treezor et n'a pas pu être accepté.\nLe paiement sera retenté automatiquement.` },
                                custom_fields: [constants_1.environmentZendesk],
                            });
                        }
                    }
                }
            }
            if (webhook.object === 'user') {
                const { users } = webhook.objectPayload;
                const zendesk = new Zendesk({
                    url: process.env.ZENDESK_API_URL,
                    email: process.env.ZENDESK_API_EMAIL,
                    token: process.env.ZENDESK_API_TOKEN,
                });
                yield Promise.all(users.map((user) => __awaiter(this, void 0, void 0, function* () {
                    if (user.userTypeId !== '2') {
                        return;
                    }
                    const company = yield this.companyRepository.findOne({ where: { treezorUserId: user.userId }, relations: ['claimer'] });
                    if (!company) {
                        return;
                    }
                    if (user.isFreezed === '1' && company.isFreezed === false) {
                        company.isFreezed = true;
                        yield company.save();
                        zendesk.tickets.create({
                            type: 'incident',
                            priority: 'hight',
                            requester: { name: company.claimer.fullName, email: company.claimer.email },
                            subject: 'Blocage compagnie',
                            comment: { body: `La compagnie ${company.name || company.brandName} a été gelée par Treezor. \n "CompagnieID ": (${company.id})` },
                            custom_fields: [constants_1.environmentZendesk],
                        });
                    }
                    if (user.isFreezed === '0' && company.isFreezed === true) {
                        company.isFreezed = false;
                        yield company.save();
                        zendesk.tickets.create({
                            type: 'incident',
                            priority: 'hight',
                            requester: { name: company.claimer.fullName, email: company.claimer.email },
                            subject: 'Déblocage compagnie',
                            comment: { body: `La compagnie ${company.name || company.brandName} a été dégelée par Treezor \n "CompagnieID ": (${company.id})` },
                            custom_fields: [constants_1.environmentZendesk],
                        });
                    }
                    if (user.kycReview === '3') {
                        company.kycStatus = company_entity_1.CompanyKycStatus.REFUSED;
                        company.treezorKycLevel = user.kycLevel;
                        company.kycComment = user.kycReviewComment;
                        yield company.save();
                        zendesk.tickets.create({
                            type: 'incident',
                            priority: 'hight',
                            requester: { name: company.claimer.fullName, email: company.claimer.email },
                            subject: 'KYC refusé',
                            comment: { body: `Le KYC a été refusée pour l'entreprise ${company.name || company.brandName} et doit être investigué : \n"kycLevel": ${user.kycLevel},\n"kycReview": ${user.kycReview},\n"kycReviewComment": ${user.kycReviewComment}, \n "CompagnieID ": (${company.id})` },
                            custom_fields: [constants_1.environmentZendesk],
                        });
                    }
                    else if (user.kycReview === '2') {
                        company.kycStatus = company_entity_1.CompanyKycStatus.VALIDATED;
                        company.treezorKycLevel = user.kycLevel;
                        company.kycComment = user.kycReviewComment;
                        yield company.save();
                    }
                })));
            }
            if (webhook.object === 'payin') {
                const { payins } = webhook.objectPayload;
                payins.forEach((payin) => __awaiter(this, void 0, void 0, function* () {
                    const company = yield this.companyRepository.findOne({ where: { treezorUserId: payin.userId }, relations: ['claimer'] });
                    if (company) {
                        yield this.paymentsService.updateLibeoBalance(company);
                        if (payin.creditorIban) {
                            yield this.bankAccountService.createOrUpdateBankAccount(company, null, { label: 'Compte auto', iban: payin.creditorIban });
                        }
                        const { users } = yield treezor.getBeneficiaries({
                            userTypeId: 1,
                            userStatus: 'VALIDATED',
                            parentUserId: company.treezorUserId,
                        });
                        let sendKyc = true;
                        users.forEach((user) => {
                            if (user.country === 'US' || user.birthCountry === 'US' || user.nationality === 'US') {
                                sendKyc = false;
                            }
                        });
                        if (sendKyc) {
                            if ([company_entity_1.CompanyKycStatus.PENDING, company_entity_1.CompanyKycStatus.REFUSED, company_entity_1.CompanyKycStatus.VALIDATED].indexOf(company.kycStatus) === -1) {
                                treezor.kycReview({ userId: payin.userId })
                                    .then(result => {
                                    company.kycStatus = company_entity_1.CompanyKycStatus.PENDING;
                                    company.save();
                                })
                                    .catch(err => {
                                    throw new common_1.HttpException(err.message, err.statusCode);
                                });
                            }
                        }
                    }
                }));
            }
            res.status(common_1.HttpStatus.OK).json(webhook);
        });
    }
};
__decorate([
    common_1.Post('webhook'),
    __param(0, common_1.Res()), __param(1, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], TreezorController.prototype, "webhook", null);
TreezorController = __decorate([
    common_1.Controller('api/v1/treezor'),
    __param(0, typeorm_2.InjectRepository(company_entity_1.Company)),
    __metadata("design:paramtypes", [typeorm_1.Repository,
        payment_repository_1.PaymentRepository,
        webhooks_service_1.WebhooksService,
        payments_service_1.PaymentsService,
        bank_account_service_1.BankAccountService])
], TreezorController);
exports.TreezorController = TreezorController;
//# sourceMappingURL=treezor.controller.js.map