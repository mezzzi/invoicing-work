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
const treezor_constants_1 = require("../../payment/treezor.constants");
const payment_entity_1 = require("../entities/payment.entity");
const payment_repository_1 = require("../repositories/payment.repository");
const typeorm_1 = require("@nestjs/typeorm");
const company_entity_1 = require("../entities/company.entity");
const typeorm_2 = require("typeorm");
const invoice_entity_1 = require("../entities/invoice.entity");
const zendesk_service_1 = require("../../notification/zendesk.service");
const zendesk_ticket_interface_1 = require("../../notification/interface/zendesk-ticket.interface");
const common_1 = require("@nestjs/common");
let TreezorPayoutWorkflow = class TreezorPayoutWorkflow {
    constructor(companyRepository, paymentRepository, zendeskService, logger) {
        this.companyRepository = companyRepository;
        this.paymentRepository = paymentRepository;
        this.zendeskService = zendeskService;
        this.logger = logger;
        this.handlePayout = (payout) => __awaiter(this, void 0, void 0, function* () {
            if (![treezor_constants_1.TREEZOR_CONSTANTS.PAYOUT_STATUS_VALIDATED, treezor_constants_1.TREEZOR_CONSTANTS.PAYOUT_STATUS_CANCELED].includes(payout.payoutStatus)) {
                this.logger.warn(`Payout webhook with ID ${payout.payoutId} was received from Treezor but was not handled since the status was not VALIDATED or CANCELLED`);
                return;
            }
            const payment = yield this.paymentRepository.findOne({ where: { treezorPayoutId: payout.payoutId }, relations: ['invoice'] });
            if (!payout || !payment) {
                throw new Error(`The payout with payoutId:${payout.payoutId} cannot be found`);
            }
            if (payout.payoutStatus === treezor_constants_1.TREEZOR_CONSTANTS.PAYOUT_STATUS_VALIDATED) {
                if (payment.invoice.status === invoice_entity_1.InvoiceStatus.PAID)
                    throw new Error(`The payment ${payment.id} with payoutId:${payout.payoutId} was already paid`);
                payment.treezorValidationAt = new Date();
                payment.status = payment_entity_1.PaymentStatus.TREEZOR_WH_VALIDATED;
                const invoice = payment.invoice;
                invoice.status = invoice_entity_1.InvoiceStatus.PAID;
                yield Promise.all([payment.save(), invoice.save()]);
            }
            if (payout.payoutStatus === treezor_constants_1.TREEZOR_CONSTANTS.PAYOUT_STATUS_CANCELED && payment.status !== payment_entity_1.PaymentStatus.CANCELLED) {
                const companyReceiver = yield this.companyRepository.findOne({ where: { id: payment.invoice.companyReceiver.id }, relations: ['claimer'] });
                const claimer = companyReceiver.claimer;
                yield this.zendeskService.createTicket({
                    type: zendesk_ticket_interface_1.ZendeskTicketType.INCIDENT,
                    priority: zendesk_ticket_interface_1.ZendesTicketPriority.URGENT,
                    requester: { name: claimer.fullName || null, email: claimer.email || null },
                    subject: 'Paiement en erreur',
                    comment: { body: `Le payout ${payout.payoutId} a été envoyé sans solde à treezor et n'a pas pu être accepté.\nLe paiement sera retenté automatiquement.` },
                });
            }
        });
    }
};
TreezorPayoutWorkflow = __decorate([
    __param(0, typeorm_1.InjectRepository(company_entity_1.Company)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        payment_repository_1.PaymentRepository,
        zendesk_service_1.ZendeskService,
        common_1.Logger])
], TreezorPayoutWorkflow);
exports.TreezorPayoutWorkflow = TreezorPayoutWorkflow;
//# sourceMappingURL=treezor-payout.workflow.js.map