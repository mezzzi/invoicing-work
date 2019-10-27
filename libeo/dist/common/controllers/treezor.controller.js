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
const typeorm_1 = require("typeorm");
const common_1 = require("@nestjs/common");
const typeorm_2 = require("@nestjs/typeorm");
const payments_service_1 = require("../services/payments.service");
const company_entity_1 = require("../entities/company.entity");
const webhook_entity_1 = require("../entities/webhook.entity");
const treezor_service_1 = require("../../payment/treezor.service");
const bank_account_service_1 = require("../services/bank-account.service");
const payin_entity_1 = require("../entities/payin.entity");
const zendesk_service_1 = require("../../notification/zendesk.service");
const zendesk_ticket_interface_1 = require("../../notification/interface/zendesk-ticket.interface");
const treezor_pipe_1 = require("../../payment/pipe/treezor.pipe");
const treezor_constants_1 = require("../../payment/treezor.constants");
const treezor_payout_workflow_1 = require("../workflow/treezor-payout.workflow");
let TreezorController = class TreezorController {
    constructor(companyRepository, payinRepository, paymentsService, bankAccountService, treezorService, zendeskService, treezorPayoutWorkflow) {
        this.companyRepository = companyRepository;
        this.payinRepository = payinRepository;
        this.paymentsService = paymentsService;
        this.bankAccountService = bankAccountService;
        this.treezorService = treezorService;
        this.zendeskService = zendeskService;
        this.treezorPayoutWorkflow = treezorPayoutWorkflow;
    }
    webhook(res, webhook) {
        return __awaiter(this, void 0, void 0, function* () {
            if (webhook.object === treezor_constants_1.TREEZOR_CONSTANTS.WEBHOOK_TYPE_PAYOUT) {
                const payouts = webhook.objectPayload.payouts;
                try {
                    yield Promise.all(payouts.map(this.treezorPayoutWorkflow.handlePayout));
                }
                catch (err) {
                    throw new common_1.BadRequestException(`The payouts related to objectId: ${webhook.objectId} were not handled correctly`, err.message);
                }
            }
            if (webhook.object === treezor_constants_1.TREEZOR_CONSTANTS.WEBHOOK_TYPE_USER) {
                const { users } = webhook.objectPayload;
                yield Promise.all(users.map((user) => __awaiter(this, void 0, void 0, function* () {
                    if (user.userTypeId !== treezor_constants_1.TREEZOR_CONSTANTS.BUSINESS_ENTITY_TYPE_ID) {
                        return;
                    }
                    const company = yield this.companyRepository.findOne({ where: { treezorUserId: user.userId }, relations: ['claimer'] });
                    if (!company) {
                        return;
                    }
                    if (user.isFreezed === treezor_constants_1.TREEZOR_CONSTANTS.ACCOUNT_FROZEN && company.isFreezed === false) {
                        company.isFreezed = true;
                        yield company.save();
                        yield this.zendeskService.createTicket({
                            type: zendesk_ticket_interface_1.ZendeskTicketType.INCIDENT,
                            priority: zendesk_ticket_interface_1.ZendesTicketPriority.HIGH,
                            requester: { name: company.claimer.fullName, email: company.claimer.email },
                            subject: 'Blocage compagnie',
                            comment: { body: `La compagnie ${company.name || company.brandName} a été gelée par Treezor. \n "CompagnieID ": (${company.id})` },
                        });
                    }
                    if (user.isFreezed === treezor_constants_1.TREEZOR_CONSTANTS.ACCOUNT_UNFROZEN && company.isFreezed === true) {
                        company.isFreezed = false;
                        yield company.save();
                        yield this.zendeskService.createTicket({
                            type: zendesk_ticket_interface_1.ZendeskTicketType.INCIDENT,
                            priority: zendesk_ticket_interface_1.ZendesTicketPriority.HIGH,
                            requester: { name: company.claimer.fullName, email: company.claimer.email },
                            subject: 'Déblocage compagnie',
                            comment: { body: `La compagnie ${company.name || company.brandName} a été dégelée par Treezor \n "CompagnieID ": (${company.id})` },
                        });
                    }
                    if (user.kycReview === treezor_constants_1.TREEZOR_CONSTANTS.USER_KYC_STATUS_CANCELED) {
                        company.kycStatus = company_entity_1.CompanyKycStatus.REFUSED;
                        company.treezorKycLevel = user.kycLevel;
                        company.kycComment = user.kycReviewComment;
                        yield company.save();
                        yield this.zendeskService.createTicket({
                            type: zendesk_ticket_interface_1.ZendeskTicketType.INCIDENT,
                            priority: zendesk_ticket_interface_1.ZendesTicketPriority.HIGH,
                            requester: { name: company.claimer.fullName, email: company.claimer.email },
                            subject: 'KYC refusé',
                            comment: { body: `Le KYC a été refusée pour l'entreprise ${company.name || company.brandName} et doit être investigué : \n"kycLevel": ${user.kycLevel},\n"kycReview": ${user.kycReview},\n"kycReviewComment": ${user.kycReviewComment}, \n "CompagnieID ": (${company.id})` },
                        });
                    }
                    else if (user.kycReview === treezor_constants_1.TREEZOR_CONSTANTS.USER_KYC_STATUS_VALIDATED) {
                        company.kycStatus = company_entity_1.CompanyKycStatus.VALIDATED;
                        company.treezorKycLevel = user.kycLevel;
                        company.kycComment = user.kycReviewComment;
                        yield company.save();
                    }
                })));
            }
            if (webhook.object === treezor_constants_1.TREEZOR_CONSTANTS.WEBHOOK_TYPE_PAYIN) {
                const { payins } = webhook.objectPayload;
                payins.forEach((treezorPayin) => __awaiter(this, void 0, void 0, function* () {
                    if (treezorPayin.paymentMethodId === treezor_constants_1.TREEZOR_CONSTANTS.PAYIN_METHOD_SEPA_DIRECT_DEBIT_CORE) {
                        const payin = yield this.payinRepository.findOne({ treezorPayinId: treezorPayin.payinId });
                        if (payin) {
                            if (webhook.object === 'payin.create') {
                                payin.treezorValidationAt = new Date();
                            }
                            else if (webhook.object === 'payin.update') {
                                payin.treezorFundReceptionAt = new Date();
                            }
                            if (treezorPayin.payinStatus === treezor_constants_1.TREEZOR_CONSTANTS.PAYIN_STATUS_VALIDATED) {
                                payin.status = payin_entity_1.PayinStatus.VALIDATED;
                            }
                            else if (treezorPayin.payinStatus === treezor_constants_1.TREEZOR_CONSTANTS.PAYIN_STATUS_CANCELED) {
                                payin.status = payin_entity_1.PayinStatus.CANCELLED;
                            }
                            yield payin.save();
                        }
                    }
                    const company = yield this.companyRepository.findOne({ where: { treezorUserId: treezorPayin.userId }, relations: ['claimer'] });
                    if (!company) {
                        return;
                    }
                    if (treezorPayin.payinStatus === treezor_constants_1.TREEZOR_CONSTANTS.PAYIN_STATUS_CANCELED) {
                        company.sddeRefusedCount = company.sddeRefusedCount + 1;
                        yield company.save();
                        if (company.sddeRefusedCount >= 2) {
                            yield this.zendeskService.createTicket({
                                type: zendesk_ticket_interface_1.ZendeskTicketType.INCIDENT,
                                priority: zendesk_ticket_interface_1.ZendesTicketPriority.NORMAL,
                                requester: { name: company.claimer.fullName, email: company.claimer.email },
                                subject: 'Blocage prélèvement automatique',
                                comment: { body: `Le mode autoprélèvement est bloqué pour l'entreprise ${company.name || company.brandName} à la suite de 2 payins refusés` },
                            });
                        }
                    }
                    yield this.paymentsService.updateLibeoBalance(company);
                    if (treezorPayin.paymentMethodId === treezor_constants_1.TREEZOR_CONSTANTS.PAYIN_METHOD_BANK_TRANSFER) {
                        const { users } = yield this.treezorService.getBeneficiaries({
                            userTypeId: 1,
                            userStatus: 'VALIDATED',
                            parentUserId: company.treezorUserId,
                        });
                        const found = users.find((user) => {
                            return user.country === 'US' || user.birthCountry === 'US' || user.nationality === 'US';
                        });
                        if (!found && !company.kycStatus) {
                            try {
                                yield this.treezorService.kycReview({ userId: treezorPayin.userId });
                                company.kycStatus = company_entity_1.CompanyKycStatus.PENDING;
                                yield company.save();
                                if (treezorPayin.DbtrIBAN) {
                                    yield this.bankAccountService.createOrUpdateBankAccount(company, null, { label: 'Compte auto', iban: treezorPayin.DbtrIBAN });
                                }
                            }
                            catch (err) {
                                throw new common_1.HttpException(err.message, err.statusCode);
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
    common_1.UsePipes(treezor_pipe_1.CamelCaseifyPayloadPipe, treezor_pipe_1.SaveTreezorWebhookPipe, treezor_pipe_1.TreezorSignatureValidationPipe),
    __param(0, common_1.Res()), __param(1, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, webhook_entity_1.Webhook]),
    __metadata("design:returntype", Promise)
], TreezorController.prototype, "webhook", null);
TreezorController = __decorate([
    common_1.Controller('api/v1/treezor'),
    __param(0, typeorm_2.InjectRepository(company_entity_1.Company)),
    __param(1, typeorm_2.InjectRepository(payin_entity_1.Payin)),
    __metadata("design:paramtypes", [typeorm_1.Repository,
        typeorm_1.Repository,
        payments_service_1.PaymentsService,
        bank_account_service_1.BankAccountService,
        treezor_service_1.TreezorService,
        zendesk_service_1.ZendeskService,
        treezor_payout_workflow_1.TreezorPayoutWorkflow])
], TreezorController);
exports.TreezorController = TreezorController;
//# sourceMappingURL=treezor.controller.js.map