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
const base_entity_1 = require("./base.entity");
const typeorm_1 = require("typeorm");
const company_entity_1 = require("./company.entity");
var PayinType;
(function (PayinType) {
    PayinType["SDDE"] = "SDDE";
})(PayinType || (PayinType = {}));
var PayinStatus;
(function (PayinStatus) {
    PayinStatus["PENDING"] = "PENDING";
    PayinStatus["VALIDATED"] = "VALIDATED";
    PayinStatus["CANCELLED"] = "CANCELLED";
})(PayinStatus = exports.PayinStatus || (exports.PayinStatus = {}));
let Payin = class Payin extends base_entity_1.Base {
};
__decorate([
    typeorm_1.ManyToOne(type => company_entity_1.Company),
    __metadata("design:type", company_entity_1.Company)
], Payin.prototype, "company", void 0);
__decorate([
    typeorm_1.Column({ type: 'double precision' }),
    __metadata("design:type", Number)
], Payin.prototype, "amount", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], Payin.prototype, "currency", void 0);
__decorate([
    typeorm_1.Column({ type: 'simple-enum', enum: PayinType, default: PayinType.SDDE }),
    __metadata("design:type", String)
], Payin.prototype, "type", void 0);
__decorate([
    typeorm_1.Column({ type: 'simple-enum', enum: PayinStatus, default: PayinStatus.PENDING }),
    __metadata("design:type", String)
], Payin.prototype, "status", void 0);
__decorate([
    typeorm_1.Column({ nullable: true }),
    __metadata("design:type", Date)
], Payin.prototype, "payinAt", void 0);
__decorate([
    typeorm_1.Column({ nullable: true }),
    __metadata("design:type", Number)
], Payin.prototype, "treezorPayinId", void 0);
__decorate([
    typeorm_1.Column({ nullable: true }),
    __metadata("design:type", Date)
], Payin.prototype, "treezorCreatedAt", void 0);
__decorate([
    typeorm_1.Column({ nullable: true }),
    __metadata("design:type", Date)
], Payin.prototype, "treezorValidationAt", void 0);
__decorate([
    typeorm_1.Column({ nullable: true }),
    __metadata("design:type", Date)
], Payin.prototype, "treezorFundReceptionAt", void 0);
__decorate([
    typeorm_1.Column({ nullable: true }),
    __metadata("design:type", Number)
], Payin.prototype, "treezorWalletId", void 0);
__decorate([
    typeorm_1.Column({ nullable: true }),
    __metadata("design:type", String)
], Payin.prototype, "treezorResponse", void 0);
Payin = __decorate([
    typeorm_1.Entity()
], Payin);
exports.Payin = Payin;
//# sourceMappingURL=payin.entity.js.map