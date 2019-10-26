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
const contact_entity_1 = require("./contact.entity");
const user_entity_1 = require("./user.entity");
const email_entity_1 = require("./email.entity");
let PaymentNotification = class PaymentNotification extends typeorm_1.BaseEntity {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn('uuid'),
    __metadata("design:type", String)
], PaymentNotification.prototype, "id", void 0);
__decorate([
    typeorm_1.ManyToOne(type => invoice_entity_1.Invoice),
    __metadata("design:type", invoice_entity_1.Invoice)
], PaymentNotification.prototype, "invoice", void 0);
__decorate([
    typeorm_1.ManyToOne(type => contact_entity_1.Contact),
    __metadata("design:type", contact_entity_1.Contact)
], PaymentNotification.prototype, "contact", void 0);
__decorate([
    typeorm_1.ManyToOne(type => user_entity_1.User),
    __metadata("design:type", user_entity_1.User)
], PaymentNotification.prototype, "createdBy", void 0);
__decorate([
    typeorm_1.ManyToOne(type => email_entity_1.Email),
    __metadata("design:type", email_entity_1.Email)
], PaymentNotification.prototype, "email", void 0);
__decorate([
    typeorm_1.CreateDateColumn(),
    __metadata("design:type", Date)
], PaymentNotification.prototype, "createdAt", void 0);
__decorate([
    typeorm_1.UpdateDateColumn(),
    __metadata("design:type", Date)
], PaymentNotification.prototype, "updatedAt", void 0);
PaymentNotification = __decorate([
    typeorm_1.Entity()
], PaymentNotification);
exports.PaymentNotification = PaymentNotification;
//# sourceMappingURL=payment-notification.entity.js.map