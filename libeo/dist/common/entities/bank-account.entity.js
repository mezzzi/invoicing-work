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
const company_entity_1 = require("./company.entity");
const base_entity_1 = require("./base.entity");
const iban_entity_1 = require("./iban.entity");
const mandate_entity_1 = require("./mandate.entity");
let BankAccount = class BankAccount extends base_entity_1.Base {
};
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], BankAccount.prototype, "label", void 0);
__decorate([
    typeorm_1.Column({ default: true }),
    __metadata("design:type", Boolean)
], BankAccount.prototype, "default", void 0);
__decorate([
    typeorm_1.Column({ default: true }),
    __metadata("design:type", Boolean)
], BankAccount.prototype, "enabled", void 0);
__decorate([
    typeorm_1.ManyToOne(type => company_entity_1.Company),
    __metadata("design:type", company_entity_1.Company)
], BankAccount.prototype, "company", void 0);
__decorate([
    typeorm_1.ManyToOne(type => iban_entity_1.Iban),
    __metadata("design:type", iban_entity_1.Iban)
], BankAccount.prototype, "iban", void 0);
__decorate([
    typeorm_1.OneToMany(type => mandate_entity_1.Mandate, mandate => mandate.bankAccount),
    __metadata("design:type", Array)
], BankAccount.prototype, "mandates", void 0);
BankAccount = __decorate([
    typeorm_1.Entity()
], BankAccount);
exports.BankAccount = BankAccount;
//# sourceMappingURL=bank-account.entity.js.map