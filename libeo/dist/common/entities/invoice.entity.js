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
const user_entity_1 = require("./user.entity");
const iban_entity_1 = require("./iban.entity");
const accounting_preference_entity_1 = require("./accounting-preference.entity");
var InvoiceStatus;
(function (InvoiceStatus) {
    InvoiceStatus["IMPORTING"] = "IMPORTING";
    InvoiceStatus["IMPORTED"] = "IMPORTED";
    InvoiceStatus["SCANNING"] = "SCANNING";
    InvoiceStatus["SCANNED"] = "SCANNED";
    InvoiceStatus["TO_PAY"] = "TO_PAY";
    InvoiceStatus["PLANNED"] = "PLANNED";
    InvoiceStatus["AR_DRAFT"] = "AR_DRAFT";
    InvoiceStatus["PAID"] = "PAID";
})(InvoiceStatus = exports.InvoiceStatus || (exports.InvoiceStatus = {}));
var InvoiceExtension;
(function (InvoiceExtension) {
    InvoiceExtension["JPG"] = "image/jpg";
    InvoiceExtension["JPEG"] = "image/jpeg";
    InvoiceExtension["GIF"] = "image/gif";
    InvoiceExtension["PNG"] = "image/png";
    InvoiceExtension["BMP"] = "image/bmp";
    InvoiceExtension["PDF"] = "application/pdf";
})(InvoiceExtension = exports.InvoiceExtension || (exports.InvoiceExtension = {}));
let Invoice = class Invoice extends typeorm_1.BaseEntity {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn('uuid'),
    __metadata("design:type", String)
], Invoice.prototype, "id", void 0);
__decorate([
    typeorm_1.ManyToOne(type => company_entity_1.Company, { eager: true }),
    __metadata("design:type", company_entity_1.Company)
], Invoice.prototype, "companyEmitter", void 0);
__decorate([
    typeorm_1.ManyToOne(type => company_entity_1.Company, { nullable: false, eager: true }),
    __metadata("design:type", company_entity_1.Company)
], Invoice.prototype, "companyReceiver", void 0);
__decorate([
    typeorm_1.ManyToOne(type => user_entity_1.User, { eager: true }),
    __metadata("design:type", user_entity_1.User)
], Invoice.prototype, "importedBy", void 0);
__decorate([
    typeorm_1.Column({
        type: 'simple-enum',
        enum: InvoiceStatus,
        default: InvoiceStatus.IMPORTING,
    }),
    __metadata("design:type", String)
], Invoice.prototype, "status", void 0);
__decorate([
    typeorm_1.Column({ nullable: true }),
    __metadata("design:type", String)
], Invoice.prototype, "receiverTitle", void 0);
__decorate([
    typeorm_1.Column({ nullable: true }),
    __metadata("design:type", String)
], Invoice.prototype, "emitterTitle", void 0);
__decorate([
    typeorm_1.Column({ nullable: true }),
    __metadata("design:type", String)
], Invoice.prototype, "number", void 0);
__decorate([
    typeorm_1.Column({ nullable: true }),
    __metadata("design:type", String)
], Invoice.prototype, "filepath", void 0);
__decorate([
    typeorm_1.Column({ nullable: true }),
    __metadata("design:type", String)
], Invoice.prototype, "filename", void 0);
__decorate([
    typeorm_1.ManyToOne(type => iban_entity_1.Iban, { eager: true }),
    typeorm_1.JoinColumn(),
    __metadata("design:type", iban_entity_1.Iban)
], Invoice.prototype, "iban", void 0);
__decorate([
    typeorm_1.Column({ nullable: true }),
    __metadata("design:type", String)
], Invoice.prototype, "currency", void 0);
__decorate([
    typeorm_1.Column({ nullable: true, type: 'double precision' }),
    __metadata("design:type", Number)
], Invoice.prototype, "total", void 0);
__decorate([
    typeorm_1.Column({ nullable: true, type: 'double precision' }),
    __metadata("design:type", Number)
], Invoice.prototype, "totalWoT", void 0);
__decorate([
    typeorm_1.Column({ nullable: true }),
    __metadata("design:type", Date)
], Invoice.prototype, "importAt", void 0);
__decorate([
    typeorm_1.Column({ nullable: true }),
    __metadata("design:type", Date)
], Invoice.prototype, "dueDate", void 0);
__decorate([
    typeorm_1.Column({ nullable: true }),
    __metadata("design:type", Date)
], Invoice.prototype, "invoiceDate", void 0);
__decorate([
    typeorm_1.Column({ nullable: true, type: 'simple-json' }),
    __metadata("design:type", Object)
], Invoice.prototype, "vatAmounts", void 0);
__decorate([
    typeorm_1.Column({ nullable: true, default: true }),
    __metadata("design:type", Boolean)
], Invoice.prototype, "enabled", void 0);
__decorate([
    typeorm_1.Column({ nullable: true, default: false }),
    __metadata("design:type", Boolean)
], Invoice.prototype, "error", void 0);
__decorate([
    typeorm_1.Column({ nullable: true }),
    __metadata("design:type", String)
], Invoice.prototype, "ocrStatus", void 0);
__decorate([
    typeorm_1.Column({ nullable: true }),
    __metadata("design:type", String)
], Invoice.prototype, "ocrPartner", void 0);
__decorate([
    typeorm_1.Column({ type: 'simple-json', nullable: true }),
    __metadata("design:type", Object)
], Invoice.prototype, "ocrSirenFeedback", void 0);
__decorate([
    typeorm_1.Column({ type: 'simple-json', nullable: true }),
    __metadata("design:type", Object)
], Invoice.prototype, "ocrFeedback", void 0);
__decorate([
    typeorm_1.Column({ nullable: true }),
    __metadata("design:type", String)
], Invoice.prototype, "code", void 0);
__decorate([
    typeorm_1.ManyToOne(type => user_entity_1.User, { nullable: true }),
    __metadata("design:type", user_entity_1.User)
], Invoice.prototype, "codeValidatedBy", void 0);
__decorate([
    typeorm_1.Column({ nullable: true }),
    __metadata("design:type", Date)
], Invoice.prototype, "codeValidatedAt", void 0);
__decorate([
    typeorm_1.ManyToOne(type => accounting_preference_entity_1.AccountingPreference, { eager: true, nullable: true }),
    __metadata("design:type", accounting_preference_entity_1.AccountingPreference)
], Invoice.prototype, "purchaseAccount", void 0);
__decorate([
    typeorm_1.CreateDateColumn(),
    __metadata("design:type", Date)
], Invoice.prototype, "createdAt", void 0);
__decorate([
    typeorm_1.UpdateDateColumn(),
    __metadata("design:type", Date)
], Invoice.prototype, "updatedAt", void 0);
__decorate([
    typeorm_1.Column({ nullable: true }),
    __metadata("design:type", String)
], Invoice.prototype, "companyEmitterId", void 0);
__decorate([
    typeorm_1.Column({ type: 'simple-json', nullable: true }),
    __metadata("design:type", Object)
], Invoice.prototype, "companyEmitterDetails", void 0);
__decorate([
    typeorm_1.Column({ type: 'simple-json', nullable: true }),
    __metadata("design:type", Object)
], Invoice.prototype, "companyEmitterContactDetails", void 0);
__decorate([
    typeorm_1.Column({ nullable: true }),
    __metadata("design:type", String)
], Invoice.prototype, "companyReceiverId", void 0);
__decorate([
    typeorm_1.Column({ type: 'simple-json', nullable: true }),
    __metadata("design:type", Object)
], Invoice.prototype, "companyReceiverDetails", void 0);
__decorate([
    typeorm_1.Column({ nullable: true }),
    __metadata("design:type", String)
], Invoice.prototype, "documentType", void 0);
__decorate([
    typeorm_1.Column({ nullable: true }),
    __metadata("design:type", String)
], Invoice.prototype, "invoiceDescription", void 0);
__decorate([
    typeorm_1.Column({ nullable: true, type: 'double precision' }),
    __metadata("design:type", Number)
], Invoice.prototype, "discount", void 0);
__decorate([
    typeorm_1.Column({ type: 'int', nullable: true }),
    __metadata("design:type", Number)
], Invoice.prototype, "templateId", void 0);
__decorate([
    typeorm_1.Column({ type: 'simple-json', nullable: true }),
    __metadata("design:type", Object)
], Invoice.prototype, "displayLegalNotice", void 0);
__decorate([
    typeorm_1.Column({ type: 'simple-json', nullable: true }),
    __metadata("design:type", Object)
], Invoice.prototype, "products", void 0);
__decorate([
    typeorm_1.Column({ nullable: true }),
    __metadata("design:type", String)
], Invoice.prototype, "arCreatedById", void 0);
__decorate([
    typeorm_1.Column({ nullable: true }),
    __metadata("design:type", String)
], Invoice.prototype, "source", void 0);
Invoice = __decorate([
    typeorm_1.Entity()
], Invoice);
exports.Invoice = Invoice;
//# sourceMappingURL=invoice.entity.js.map