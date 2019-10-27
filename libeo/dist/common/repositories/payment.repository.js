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
const typeorm_1 = require("typeorm");
const payment_entity_1 = require("../entities/payment.entity");
const company_entity_1 = require("../entities/company.entity");
let PaymentRepository = class PaymentRepository extends typeorm_1.Repository {
    sumInvoicesByStatusAndDueAt(status, paymentAt, company) {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield this.createQueryBuilder('p')
                .select('SUM(i.total)', 'sum')
                .leftJoin('p.invoice', 'i')
                .leftJoin('i.companyReceiver', 'c')
                .where('p.paymentAt <= :paymentAt', { paymentAt })
                .andWhere('p.status IN(:...status)', { status })
                .andWhere('p.libeoEstimatedBalance >= 0')
                .andWhere('c.id = :companyReceiverId', { companyReceiverId: company.id })
                .getRawOne();
            return (res && res.sum) ? res.sum : 0;
        });
    }
    getDeferredPayments() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.createQueryBuilder('p')
                .leftJoinAndSelect('p.payin', 'payin')
                .leftJoinAndSelect('p.invoice', 'i')
                .leftJoinAndSelect('i.companyReceiver', 'c')
                .where('p.paymentAt <= :date', { date: new Date() })
                .andWhere('p.treezorBeneficiaryId is not null')
                .andWhere('p.status IN(:...status)', { status: [
                    payment_entity_1.PaymentStatus.REQUESTED,
                    payment_entity_1.PaymentStatus.TREEZOR_SYNC_KO_NOT_ENOUGH_BALANCE,
                    payment_entity_1.PaymentStatus.TREEZOR_SYNC_KO_MISC,
                    payment_entity_1.PaymentStatus.TREEZOR_WH_KO_NOT_ENOUGH_BALANCE,
                    payment_entity_1.PaymentStatus.TREEZOR_WH_KO_MISC,
                ] })
                .andWhere('p.libeoEstimatedBalance > 0')
                .andWhere('c.kycStatus = :companyKycStatus', { companyKycStatus: company_entity_1.CompanyKycStatus.VALIDATED })
                .andWhere('c.isFreezed IS NOT TRUE')
                .getMany();
        });
    }
    getPlannedPayments(companyReceiver, paymentAt) {
        return __awaiter(this, void 0, void 0, function* () {
            const q = this.createQueryBuilder('p');
            q.leftJoinAndSelect('p.invoice', 'i')
                .leftJoin('i.companyReceiver', 'c')
                .where('p.status IN (:...status)', { status: payment_entity_1.getStatusLibeoBalance });
            if (paymentAt) {
                q.andWhere('p.paymentAt > :date', { date: paymentAt });
            }
            return q
                .andWhere('c.id = :companyReceiverId', { companyReceiverId: companyReceiver.id })
                .orderBy('p.paymentAt', 'ASC')
                .getMany();
        });
    }
};
PaymentRepository = __decorate([
    typeorm_1.EntityRepository(payment_entity_1.Payment)
], PaymentRepository);
exports.PaymentRepository = PaymentRepository;
//# sourceMappingURL=payment.repository.js.map