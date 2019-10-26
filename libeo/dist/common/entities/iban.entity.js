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
const user_entity_1 = require("./user.entity");
const company_entity_1 = require("./company.entity");
const encrypt_value_transformer_1 = require("../value-transformer/encrypt.value-transformer");
var IbanStatus;
(function (IbanStatus) {
    IbanStatus["PASSED"] = "passed";
    IbanStatus["FAILED"] = "failed";
    IbanStatus["BLACKLIST"] = "blacklist";
    IbanStatus["FAKE"] = "fake";
})(IbanStatus = exports.IbanStatus || (exports.IbanStatus = {}));
let Iban = class Iban extends typeorm_1.BaseEntity {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn('uuid'),
    __metadata("design:type", String)
], Iban.prototype, "id", void 0);
__decorate([
    typeorm_1.Column({ nullable: true, transformer: encrypt_value_transformer_1.encrypt }),
    __metadata("design:type", String)
], Iban.prototype, "iban", void 0);
__decorate([
    typeorm_1.ManyToOne(type => company_entity_1.Company),
    __metadata("design:type", company_entity_1.Company)
], Iban.prototype, "readerCompany", void 0);
__decorate([
    typeorm_1.Column({ nullable: true }),
    __metadata("design:type", Number)
], Iban.prototype, "treezorBeneficiaryId", void 0);
__decorate([
    typeorm_1.ManyToOne(type => user_entity_1.User),
    __metadata("design:type", user_entity_1.User)
], Iban.prototype, "createdBy", void 0);
__decorate([
    typeorm_1.ManyToOne(type => company_entity_1.Company),
    __metadata("design:type", company_entity_1.Company)
], Iban.prototype, "company", void 0);
__decorate([
    typeorm_1.Column({ nullable: true }),
    __metadata("design:type", String)
], Iban.prototype, "result", void 0);
__decorate([
    typeorm_1.Column({ nullable: true }),
    __metadata("design:type", Number)
], Iban.prototype, "returnCode", void 0);
__decorate([
    typeorm_1.Column({ nullable: true }),
    __metadata("design:type", String)
], Iban.prototype, "bic", void 0);
__decorate([
    typeorm_1.Column({ type: 'simple-json', nullable: true }),
    __metadata("design:type", Object)
], Iban.prototype, "bicCondidates", void 0);
__decorate([
    typeorm_1.Column({ nullable: true }),
    __metadata("design:type", String)
], Iban.prototype, "country", void 0);
__decorate([
    typeorm_1.Column({ nullable: true }),
    __metadata("design:type", String)
], Iban.prototype, "bankCode", void 0);
__decorate([
    typeorm_1.Column({ nullable: true }),
    __metadata("design:type", String)
], Iban.prototype, "bank", void 0);
__decorate([
    typeorm_1.Column({ nullable: true }),
    __metadata("design:type", String)
], Iban.prototype, "bankAddress", void 0);
__decorate([
    typeorm_1.Column({ nullable: true }),
    __metadata("design:type", String)
], Iban.prototype, "branch", void 0);
__decorate([
    typeorm_1.Column({ nullable: true }),
    __metadata("design:type", String)
], Iban.prototype, "branchCode", void 0);
__decorate([
    typeorm_1.Column({ nullable: true }),
    __metadata("design:type", String)
], Iban.prototype, "inSclDirectory", void 0);
__decorate([
    typeorm_1.Column({ nullable: true }),
    __metadata("design:type", String)
], Iban.prototype, "sct", void 0);
__decorate([
    typeorm_1.Column({ nullable: true }),
    __metadata("design:type", String)
], Iban.prototype, "sdd", void 0);
__decorate([
    typeorm_1.Column({ nullable: true }),
    __metadata("design:type", String)
], Iban.prototype, "cor1", void 0);
__decorate([
    typeorm_1.Column({ nullable: true }),
    __metadata("design:type", String)
], Iban.prototype, "b2b", void 0);
__decorate([
    typeorm_1.Column({ nullable: true }),
    __metadata("design:type", String)
], Iban.prototype, "scc", void 0);
__decorate([
    typeorm_1.Column({ type: 'simple-json', nullable: true }),
    __metadata("design:type", Object)
], Iban.prototype, "jsonIbanBic", void 0);
__decorate([
    typeorm_1.CreateDateColumn({ nullable: true }),
    __metadata("design:type", Date)
], Iban.prototype, "createdAt", void 0);
__decorate([
    typeorm_1.UpdateDateColumn({ nullable: true }),
    __metadata("design:type", Date)
], Iban.prototype, "updatedAt", void 0);
Iban = __decorate([
    typeorm_1.Entity()
], Iban);
exports.Iban = Iban;
//# sourceMappingURL=iban.entity.js.map