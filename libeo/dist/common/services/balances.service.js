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
const treezor_service_1 = require("../../payment/treezor.service");
const invoice_entity_1 = require("../entities/invoice.entity");
const invoices_service_1 = require("./invoices.service");
const payment_repository_1 = require("../repositories/payment.repository");
const typeorm_1 = require("@nestjs/typeorm");
const payment_entity_1 = require("../entities/payment.entity");
let BalancesService = class BalancesService {
    constructor(invoicesService, paymentRepository) {
        this.invoicesService = invoicesService;
        this.paymentRepository = paymentRepository;
    }
    getBalance(company) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!company || !company.treezorWalletId) {
                return null;
            }
            const treezor = new treezor_service_1.TreezorService({
                baseUrl: process.env.TREEZOR_API_URL,
                token: process.env.TREEZOR_TOKEN,
                secretKey: process.env.TREEZOR_SECRET_KEY,
            });
            try {
                const { balances } = yield treezor.getBalances({ walletId: company.treezorWalletId });
                const [balance] = balances;
                return balance;
            }
            catch (err) {
                throw new common_1.HttpException(err.message, common_1.HttpStatus.BAD_GATEWAY);
            }
        });
    }
    calculationLibeoBalance(balance, paymentAt, company) {
        return __awaiter(this, void 0, void 0, function* () {
            const sumInvoices = yield this.paymentRepository.sumInvoicesByStatusAndDueAt(payment_entity_1.getStatusLibeoBalance, paymentAt, company);
            return balance.authorizedBalance - sumInvoices;
        });
    }
    checkBalance(balance, company, invoiceId, paymentAt) {
        return __awaiter(this, void 0, void 0, function* () {
            const invoice = yield this.invoicesService.findOneByIdAndCurrentCompany(invoiceId, company);
            if (invoice.status !== invoice_entity_1.InvoiceStatus.TO_PAY) {
                throw new common_1.HttpException('api.error.invoice.invalid_status', common_1.HttpStatus.BAD_REQUEST);
            }
            if (invoice.total < (yield this.calculationLibeoBalance(balance, paymentAt, company))) {
                return true;
            }
            return false;
        });
    }
};
BalancesService = __decorate([
    common_1.Injectable(),
    __param(1, typeorm_1.InjectRepository(payment_repository_1.PaymentRepository)),
    __metadata("design:paramtypes", [invoices_service_1.InvoicesService,
        payment_repository_1.PaymentRepository])
], BalancesService);
exports.BalancesService = BalancesService;
//# sourceMappingURL=balances.service.js.map