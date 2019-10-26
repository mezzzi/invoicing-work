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
const base_entity_1 = require("./base.entity");
const bank_account_entity_1 = require("./bank-account.entity");
const user_entity_1 = require("./user.entity");
var MandateStatus;
(function (MandateStatus) {
    MandateStatus["PENDING"] = "PENDING";
    MandateStatus["VALIDATED"] = "VALIDATED";
    MandateStatus["SIGNED"] = "SIGNED";
    MandateStatus["CANCELED"] = "CANCELED";
})(MandateStatus = exports.MandateStatus || (exports.MandateStatus = {}));
let Mandate = class Mandate extends base_entity_1.Base {
};
__decorate([
    typeorm_1.ManyToOne(type => bank_account_entity_1.BankAccount, bankAccount => bankAccount.mandates),
    __metadata("design:type", bank_account_entity_1.BankAccount)
], Mandate.prototype, "bankAccount", void 0);
__decorate([
    typeorm_1.Column({ nullable: true }),
    __metadata("design:type", String)
], Mandate.prototype, "treezorMandateId", void 0);
__decorate([
    typeorm_1.Column({ nullable: true }),
    __metadata("design:type", String)
], Mandate.prototype, "rum", void 0);
__decorate([
    typeorm_1.Column({ nullable: true }),
    __metadata("design:type", String)
], Mandate.prototype, "filePath", void 0);
__decorate([
    typeorm_1.Column({ type: 'simple-enum', enum: MandateStatus, nullable: true }),
    __metadata("design:type", String)
], Mandate.prototype, "status", void 0);
__decorate([
    typeorm_1.ManyToOne(type => user_entity_1.User),
    __metadata("design:type", user_entity_1.User)
], Mandate.prototype, "signatory", void 0);
__decorate([
    typeorm_1.Column({ nullable: true }),
    __metadata("design:type", String)
], Mandate.prototype, "signatoryIp", void 0);
__decorate([
    typeorm_1.Column({ nullable: true }),
    __metadata("design:type", String)
], Mandate.prototype, "validationCode", void 0);
__decorate([
    typeorm_1.Column({ nullable: true }),
    __metadata("design:type", Date)
], Mandate.prototype, "signaturedAt", void 0);
Mandate = __decorate([
    typeorm_1.Entity()
], Mandate);
exports.Mandate = Mandate;
//# sourceMappingURL=mandate.entity.js.map