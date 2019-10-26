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
const export_entity_1 = require("./export.entity");
const accounting_preference_entity_1 = require("./accounting-preference.entity");
var AccountingEntryType;
(function (AccountingEntryType) {
    AccountingEntryType["INVOICE"] = "INVOICE";
    AccountingEntryType["PAYMENT"] = "PAYMENT";
})(AccountingEntryType = exports.AccountingEntryType || (exports.AccountingEntryType = {}));
var AccountingEntryPostingType;
(function (AccountingEntryPostingType) {
    AccountingEntryPostingType["CREDIT"] = "CREDIT";
    AccountingEntryPostingType["DEBIT"] = "DEBIT";
})(AccountingEntryPostingType = exports.AccountingEntryPostingType || (exports.AccountingEntryPostingType = {}));
let AccountingEntry = class AccountingEntry extends base_entity_1.Base {
};
__decorate([
    typeorm_1.ManyToOne(type => company_entity_1.Company),
    __metadata("design:type", company_entity_1.Company)
], AccountingEntry.prototype, "company", void 0);
__decorate([
    typeorm_1.ManyToOne(type => accounting_preference_entity_1.AccountingPreference),
    __metadata("design:type", accounting_preference_entity_1.AccountingPreference)
], AccountingEntry.prototype, "ledger", void 0);
__decorate([
    typeorm_1.ManyToOne(type => accounting_preference_entity_1.AccountingPreference),
    __metadata("design:type", accounting_preference_entity_1.AccountingPreference)
], AccountingEntry.prototype, "account", void 0);
__decorate([
    typeorm_1.Column({ nullable: true, type: 'simple-enum', enum: AccountingEntryPostingType }),
    __metadata("design:type", String)
], AccountingEntry.prototype, "postingType", void 0);
__decorate([
    typeorm_1.Column({ nullable: true }),
    __metadata("design:type", Date)
], AccountingEntry.prototype, "entryDate", void 0);
__decorate([
    typeorm_1.Column({ nullable: true }),
    __metadata("design:type", String)
], AccountingEntry.prototype, "entryRef", void 0);
__decorate([
    typeorm_1.Column({ nullable: true }),
    __metadata("design:type", String)
], AccountingEntry.prototype, "entryLabel", void 0);
__decorate([
    typeorm_1.Column({ nullable: true, type: 'double precision' }),
    __metadata("design:type", Number)
], AccountingEntry.prototype, "entryAmount", void 0);
__decorate([
    typeorm_1.Column({ nullable: true }),
    __metadata("design:type", String)
], AccountingEntry.prototype, "entryCurrency", void 0);
__decorate([
    typeorm_1.Column({ nullable: true, type: 'simple-enum', enum: AccountingEntryType }),
    __metadata("design:type", String)
], AccountingEntry.prototype, "entryType", void 0);
__decorate([
    typeorm_1.ManyToOne(type => export_entity_1.Export, { nullable: true }),
    __metadata("design:type", export_entity_1.Export)
], AccountingEntry.prototype, "export", void 0);
AccountingEntry = __decorate([
    typeorm_1.Entity()
], AccountingEntry);
exports.AccountingEntry = AccountingEntry;
//# sourceMappingURL=accounting-entry.entity.js.map