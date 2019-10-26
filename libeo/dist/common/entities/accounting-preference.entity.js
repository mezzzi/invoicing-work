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
const company_entity_1 = require("./company.entity");
var AccountingPreferenceType;
(function (AccountingPreferenceType) {
    AccountingPreferenceType["LEDGER_BANK"] = "LEDGER_BANK";
    AccountingPreferenceType["LEDGER_PURCHASE"] = "LEDGER_PURCHASE";
    AccountingPreferenceType["LEDGER_SALES"] = "LEDGER_SALES";
    AccountingPreferenceType["LEDGER_MISC"] = "LEDGER_MISC";
    AccountingPreferenceType["VAT_ACCOUNT"] = "VAT_ACCOUNT";
    AccountingPreferenceType["VENDOR_ACCOUNT"] = "VENDOR_ACCOUNT";
    AccountingPreferenceType["PURCHASE_ACCOUNT"] = "PURCHASE_ACCOUNT";
    AccountingPreferenceType["BANK_ACCOUNT"] = "BANK_ACCOUNT";
    AccountingPreferenceType["BANK_ACCOUNT_TREEZOR"] = "BANK_ACCOUNT_TREEZOR";
})(AccountingPreferenceType = exports.AccountingPreferenceType || (exports.AccountingPreferenceType = {}));
let AccountingPreference = class AccountingPreference extends base_entity_1.Base {
};
__decorate([
    typeorm_1.ManyToOne(type => company_entity_1.Company, { nullable: true }),
    __metadata("design:type", company_entity_1.Company)
], AccountingPreference.prototype, "company", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], AccountingPreference.prototype, "key", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], AccountingPreference.prototype, "value", void 0);
__decorate([
    typeorm_1.Column({ nullable: true }),
    __metadata("design:type", String)
], AccountingPreference.prototype, "description", void 0);
__decorate([
    typeorm_1.Column({ type: 'simple-enum', enum: AccountingPreferenceType, default: AccountingPreferenceType.LEDGER_PURCHASE }),
    __metadata("design:type", String)
], AccountingPreference.prototype, "type", void 0);
__decorate([
    typeorm_1.Column({ default: true }),
    __metadata("design:type", Boolean)
], AccountingPreference.prototype, "enabled", void 0);
__decorate([
    typeorm_1.Column({ default: 0 }),
    __metadata("design:type", Number)
], AccountingPreference.prototype, "order", void 0);
AccountingPreference = __decorate([
    typeorm_1.Entity()
], AccountingPreference);
exports.AccountingPreference = AccountingPreference;
//# sourceMappingURL=accounting-preference.entity.js.map