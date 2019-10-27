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
const moment = require("moment-business-days");
const treezor_service_1 = require("../../payment/treezor.service");
const common_1 = require("@nestjs/common");
const payment_entity_1 = require("../entities/payment.entity");
const company_entity_1 = require("../entities/company.entity");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const balances_service_1 = require("../services/balances.service");
const companies_service_1 = require("../services/companies.service");
const payins_service_1 = require("../services/payins.service");
const payin_entity_1 = require("../entities/payin.entity");
const zendesk_service_1 = require("../../notification/zendesk.service");
const zendesk_ticket_interface_1 = require("../../notification/interface/zendesk-ticket.interface");
const ERROR_CODE_TREEZOR_NOT_ENOUGH_BALANCE = 16018;
let PaymentsWorkflow = class PaymentsWorkflow {
    constructor(companyRepository, companiesService, balancesService, payinsService, treezorService, zendeskService, logger) {
        this.companyRepository = companyRepository;
        this.companiesService = companiesService;
        this.balancesService = balancesService;
        this.payinsService = payinsService;
        this.treezorService = treezorService;
        this.zendeskService = zendeskService;
        this.logger = logger;
        this.processPayment = (payment) => __awaiter(this, void 0, void 0, function* () {
            try {
                this.logger.verbose(`Payment ${payment.id} - Start workflow`);
                this.logger.verbose(`Payment ${payment.id} - Mode ${payment.invoice.companyReceiver.provisionningStrategy}`);
                payment.status = payment_entity_1.PaymentStatus.BEING_PROCESSED;
                yield payment.save();
                this.logger.verbose(`Payment ${payment.id} - Status Being processed saved`);
                if (payment.invoice.companyReceiver.provisionningStrategy === company_entity_1.CompanyProvisionningStrategies.AUTOLOAD) {
                    yield this.handlePaymentWithAutoload(payment);
                }
                else {
                    yield this.handlePaymentWithTopUp(payment);
                }
                this.logger.log(`Payment ${payment.id} passed`);
            }
            catch (err) {
                this.logger.error(`Payment ${payment.id} - Error message: ${err.message}`);
                if (payment.status === payment_entity_1.PaymentStatus.BEING_PROCESSED) {
                    payment.status = payment_entity_1.PaymentStatus.TREEZOR_SYNC_KO_MISC;
                }
                payment.treezorRequestAt = new Date();
                yield payment.save();
            }
        });
        this.handlePaymentWithTopUp = (payment) => __awaiter(this, void 0, void 0, function* () {
            this.logger.log(`Payment ${payment.id} - Generate a payout`);
            try {
                this.logger.verbose(`Payment ${payment.id} - Generate Payout`);
                const payout = yield this.treezorService.createPayout({
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
                this.logger.verbose(`Payment ${payment.id} - Payout Generated ${payout.payoutId}`);
                yield payment.save();
                this.logger.verbose(`Payment ${payment.id} - Payout saved`);
                return payment;
            }
            catch (err) {
                if (err.code === ERROR_CODE_TREEZOR_NOT_ENOUGH_BALANCE) {
                    payment.status = payment_entity_1.PaymentStatus.TREEZOR_SYNC_KO_NOT_ENOUGH_BALANCE;
                }
                yield this.balancesService.updateLibeoBalance(payment.invoice.companyReceiver, payment);
                this.sendToZendesk(payment, 'Paiement en erreur', `Le paiement ${payment.id} est retourné en erreur par treezor et demande une investiguation.\nLe paiement sera retenté automatiquement.\nMessage d'erreur : ${err.message}`);
                throw new Error(err);
            }
        });
        this.handlePaymentWithAutoload = (payment) => __awaiter(this, void 0, void 0, function* () {
            if (payment.payin) {
                this.logger.log(`Payment ${payment.id} - Payin already generated in status ${payment.payin.status}`);
                if (payment.payin.status === payin_entity_1.PayinStatus.VALIDATED) {
                    yield this.handlePaymentWithTopUp(payment);
                }
                return;
            }
            this.logger.log(`Payment ${payment.id} - Generate a payin`);
            const invoice = payment.invoice;
            const company = invoice.companyReceiver;
            if (company.sddeRefusedCount > 2) {
                return;
            }
            const amount = invoice.total;
            const mandate = yield this.companiesService.getSignedMandate(company);
            const payinDate = moment(payment.paymentAt).format('YYYY-MM-DD');
            const messageToUser = `Libeo - ${invoice.number || ''} ${company.name || company.brandName || ''}`;
            const currency = 'EUR';
            moment.updateLocale('fr', {
                holidays: [
                    '01/01',
                    '19/04',
                    '22/04',
                    '01/05',
                    '25/12',
                    '26/12',
                ],
                holidayFormat: 'DD/MM',
                workingWeekdays: [1, 2, 3, 4, 5]
            });
            const nextBusinessDay = moment(payinDate).add('1', 'days').nextBusinessDay().format('YYYY-MM-DD');
            const body = {
                amount,
                currency,
                paymentMethodId: 21,
                walletId: 194026,
                mandateId: mandate.treezorMandateId,
                payinDate: nextBusinessDay,
                messageToUser,
            };
            const payin = yield this.payinsService.createPayin({
                amount,
                currency,
                company: payment.invoice.companyReceiver,
                payinAt: payment.paymentAt,
            });
            payment.payin = payin;
            yield payment.save();
            try {
                const treezorPayin = yield this.treezorService.createPayin(body);
                yield this.payinsService.hydratePayinWithTreezor(payin, treezorPayin);
            }
            catch (err) {
                this.logger.error(err);
                throw new Error(err);
            }
            return;
        });
    }
    sendToZendesk(payment, subject, message) {
        return __awaiter(this, void 0, void 0, function* () {
            if (process.env.NODE_ENV === 'test') {
                return;
            }
            const companyReceiver = yield this.companyRepository.findOne({ where: { id: payment.invoice.companyReceiver.id }, relations: ['claimer'] });
            const claimer = companyReceiver.claimer;
            yield this.zendeskService.createTicket({
                type: zendesk_ticket_interface_1.ZendeskTicketType.INCIDENT,
                priority: zendesk_ticket_interface_1.ZendesTicketPriority.URGENT,
                requester: { name: claimer.fullName || null, email: claimer.email || null },
                subject,
                comment: { body: message },
            });
        });
    }
};
PaymentsWorkflow = __decorate([
    common_1.Injectable(),
    __param(0, typeorm_1.InjectRepository(company_entity_1.Company)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        companies_service_1.CompaniesService,
        balances_service_1.BalancesService,
        payins_service_1.PayinsService,
        treezor_service_1.TreezorService,
        zendesk_service_1.ZendeskService,
        common_1.Logger])
], PaymentsWorkflow);
exports.PaymentsWorkflow = PaymentsWorkflow;
//# sourceMappingURL=payments.workflow.js.map