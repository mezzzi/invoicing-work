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
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
const invoice_entity_1 = require("./invoice.entity");
const user_entity_1 = require("./user.entity");
const base_entity_1 = require("./base.entity");
const payin_entity_1 = require("./payin.entity");
var PaymentStatus;
(function (PaymentStatus) {
    PaymentStatus["REQUESTED"] = "REQUESTED";
    PaymentStatus["BEING_PROCESSED"] = "BEING_PROCESSED";
    PaymentStatus["TREEZOR_PENDING"] = "TREEZOR_PENDING";
    PaymentStatus["TREEZOR_SYNC_KO_NOT_ENOUGH_BALANCE"] = "TREEZOR_SYNC_KO_NOT_ENOUGH_BALANCE";
    PaymentStatus["TREEZOR_SYNC_KO_MISC"] = "TREEZOR_SYNC_KO_MISC";
    PaymentStatus["TREEZOR_WH_KO_NOT_ENOUGH_BALANCE"] = "TREEZOR_WH_KO_NOT_ENOUGH_BALANCE";
    PaymentStatus["TREEZOR_WH_KO_MISC"] = "TREEZOR_WH_KO_MISC";
    PaymentStatus["TREEZOR_WH_VALIDATED"] = "TREEZOR_WH_VALIDATED";
    PaymentStatus["CANCELLED"] = "CANCELLED";
})(PaymentStatus = exports.PaymentStatus || (exports.PaymentStatus = {}));
exports.getStatusLibeoBalance = [
    PaymentStatus.REQUESTED,
    PaymentStatus.BEING_PROCESSED,
    PaymentStatus.TREEZOR_SYNC_KO_NOT_ENOUGH_BALANCE,
    PaymentStatus.TREEZOR_SYNC_KO_MISC,
    PaymentStatus.TREEZOR_WH_KO_NOT_ENOUGH_BALANCE,
    PaymentStatus.TREEZOR_WH_KO_MISC,
];
let Payment = class Payment extends base_entity_1.Base {
};
__decorate([
    typeorm_1.ManyToOne(type => invoice_entity_1.Invoice),
    __metadata("design:type", invoice_entity_1.Invoice)
], Payment.prototype, "invoice", void 0);
__decorate([
    typeorm_1.Column({ type: 'simple-enum', enum: PaymentStatus, default: PaymentStatus.REQUESTED }),
    __metadata("design:type", String)
], Payment.prototype, "status", void 0);
__decorate([
    typeorm_1.Column({ nullable: true, type: 'double precision' }),
    __metadata("design:type", Number)
], Payment.prototype, "amount", void 0);
__decorate([
    typeorm_1.Column({ nullable: true }),
    __metadata("design:type", String)
], Payment.prototype, "currency", void 0);
__decorate([
    typeorm_1.Column({ nullable: true, type: 'double precision' }),
    __metadata("design:type", Number)
], Payment.prototype, "libeoEstimatedBalance", void 0);
__decorate([
    typeorm_1.ManyToOne(type => user_entity_1.User),
    __metadata("design:type", user_entity_1.User)
], Payment.prototype, "paymentRequestUser", void 0);
__decorate([
    typeorm_1.Column({ nullable: true }),
    __metadata("design:type", Date)
], Payment.prototype, "cancellationRequestAt", void 0);
__decorate([
    typeorm_1.ManyToOne(type => user_entity_1.User, { nullable: true }),
    __metadata("design:type", user_entity_1.User)
], Payment.prototype, "cancellationRequestUser", void 0);
__decorate([
    typeorm_1.Column({ nullable: true }),
    __metadata("design:type", Date)
], Payment.prototype, "paymentAt", void 0);
__decorate([
    typeorm_1.Column({ nullable: true }),
    __metadata("design:type", Date)
], Payment.prototype, "treezorRequestAt", void 0);
__decorate([
    typeorm_1.Column({ nullable: true }),
    __metadata("design:type", Number)
], Payment.prototype, "treezorPayoutId", void 0);
__decorate([
    typeorm_1.Column({ nullable: true }),
    __metadata("design:type", Date)
], Payment.prototype, "treezorValidationAt", void 0);
__decorate([
    typeorm_1.Column({ nullable: true }),
    __metadata("design:type", Number)
], Payment.prototype, "treezorPayerWalletId", void 0);
__decorate([
    typeorm_1.Column({ nullable: true }),
    __metadata("design:type", Number)
], Payment.prototype, "treezorBeneficiaryId", void 0);
__decorate([
    typeorm_1.OneToOne(type => payin_entity_1.Payin, { onDelete: 'SET NULL' }),
    typeorm_1.JoinColumn(),
    __metadata("design:type", payin_entity_1.Payin)
], Payment.prototype, "payin", void 0);
Payment = __decorate([
    typeorm_1.Entity()
], Payment);
exports.Payment = Payment;
//# sourceMappingURL=payment.entity.js.map